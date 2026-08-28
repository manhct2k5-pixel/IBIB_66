import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { AITriageRequest, AITriageResponse, AITriageData } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Verified list of departments in Bach Mai Hospital
const VERIFIED_BACH_MAI_DEPARTMENTS: Record<string, { name: string; buildingId: string; floorId?: string }> = {
  "dept_a9_emergency": { name: "Trung Tâm Cấp Cứu A9 (24/7)", buildingId: "A9" },
  "dept_stroke_a10": { name: "Trung Tâm Đột Quỵ (Tòa A10)", buildingId: "A10" },
  "dept_poison_k3": { name: "Trung Tâm Chống Độc Quốc Gia (Tòa K3)", buildingId: "K3" },
  "dept_derma_k3": { name: "Khoa Da Liễu & Bỏng (Tòa K3)", buildingId: "K3" },
  "dept_reception_k1": { name: "Sảnh Tiếp Đón & Đăng Ký Khám (Tòa K1)", buildingId: "K1" },
  "dept_internal_k1": { name: "Phòng Khám Nội Tổng Quát (Tòa K1)", buildingId: "K1" },
  "dept_gastro_k1": { name: "Phòng Khám Tiêu Hóa - Gan Mật (Tòa K1)", buildingId: "K1" },
  "dept_cardiology_vtm": { name: "Viện Tim Mạch Quốc Gia (Khối nhà bên trái)", buildingId: "VTM" },
  "dept_onco_h": { name: "Viện Y Học Hạt Nhân & Ung Bướu (Tòa H)", buildingId: "H" },
  "dept_tropical_f": { name: "Viện Y Học Nhiệt Đới & Phòng Tiêm Chủng (Tòa F)", buildingId: "F" },
  "dept_eye_dental_f": { name: "Khoa Mắt & Răng Hàm Mặt (Tòa F)", buildingId: "F" },
  "dept_neuro_t1": { name: "Viện Thần Kinh (Cụm T1-T3)", buildingId: "T1" },
  "dept_mental_t4": { name: "Viện Sức Khỏe Tâm Thần (Cụm T4-T6)", buildingId: "T4" },
  "dept_trad_d2": { name: "Khoa Y Học Cổ Truyền (Tòa D2)", buildingId: "D2" },
  "dept_rehab_d4": { name: "Viện Phục Hồi Chức Năng (Tòa D4)", buildingId: "D4" },
  "dept_allergy_d6": { name: "Trung Tâm Dị Ứng - Miễn Dịch Lâm Sàng (Tòa D6)", buildingId: "D6" },
  "dept_pharmacy_k1": { name: "Nhà Thuốc Bệnh Viện (Tòa K1)", buildingId: "K1" },
  "dept_cashier_k1": { name: "Quầy Thu Viện Phí (Tòa K1)", buildingId: "K1" }
};

function checkEmergencyKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("đau ngực dữ dội") ||
    lower.includes("khó thở") ||
    lower.includes("hôn mê") ||
    lower.includes("co giật") ||
    lower.includes("chảy máu nhiều") ||
    lower.includes("mất máu") ||
    lower.includes("ngất") ||
    lower.includes("cấp cứu") ||
    lower.includes("ngộ độc") ||
    lower.includes("đột quỵ") ||
    lower.includes("méo miệng") ||
    lower.includes("liệt nửa người")
  );
}

// AI Hospital Triage & Navigation Assistant Endpoint
app.post("/api/triage", async (req, res) => {
  const reqBody: AITriageRequest = req.body;
  const { query, currentLocation, language = "vi" } = reqBody;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing or invalid query" });
  }

  const isEmergency = checkEmergencyKeywords(query);

  // Fallback response builder when Gemini API key is missing or on error
  const createFallbackResponse = (): AITriageResponse => {
    if (isEmergency) {
      return {
        reply: "CẢNH BÁO: Triệu chứng có dấu hiệu khẩn cấp. Hãy gọi 115 hoặc di chuyển ngay tới Trung tâm Cấp cứu A9 (gần Cổng 1 đường Giải Phóng). Hotline A9: 086 958 7707.",
        triage: {
          suggestedDepartmentId: "dept_a9_emergency",
          departmentName: "Trung Tâm Cấp Cứu A9 (24/7)",
          buildingId: "A9",
          urgency: "emergency",
          instructions: [
            "Gọi 115 hoặc Hotline Cấp cứu A9: 086 958 7707",
            "Ưu tiên theo hướng dẫn của nhân viên y tế",
            "Không tự đi vòng quanh bệnh viện để tìm tòa nhà"
          ]
        }
      };
    }

    return {
      reply: `Đối với triệu chứng hoặc câu hỏi "${query}", bạn vui lòng đến Sảnh Tiếp Đón & Đăng Ký Khám tại Tòa K1 (thuận tiện vào từ Cổng 4 đường Giải Phóng) để được nhân viên y tế phân luồng vào chuyên khoa phù hợp. Lưu ý: Gợi ý của AI không thay thế chẩn đoán của bác sĩ.`,
      triage: {
        suggestedDepartmentId: "dept_reception_k1",
        departmentName: "Sảnh Tiếp Đón & Đăng Ký Khám (Tòa K1)",
        buildingId: "K1",
        urgency: "normal",
        instructions: [
          "Vào từ Cổng 4 (đường Giải Phóng) để tới Tòa K1 thuận tiện nhất",
          "Đã đến Tòa K1. Vui lòng xem biển chỉ dẫn hoặc hỏi nhân viên tại quầy tiếp đón.",
          "Xuất trình thẻ BHYT hoặc CCCD để đăng ký phòng khám chuyên khoa"
        ]
      }
    };
  };

  const ai = getGeminiClient();

  if (!ai) {
    return res.json(createFallbackResponse());
  }

  try {
    const prompt = `Bạn là Trợ lý AI Hướng Dẫn Định Hướng & Phân Luồng Khám Bệnh cho Bệnh viện Bạch Mai (Hà Nội).
Yêu cầu an toàn y tế bắt buộc:
1. Gợi ý của AI CHỈ mang tính định hướng di chuyển trong bệnh viện, KHÔNG thay thế chẩn đoán y khoa của bác sĩ.
2. Với các triệu chứng nguy kịch (đau ngực dữ dội, khó thở, hôn mê, co giật, chảy máu nhiều, méo miệng/yếu liệt nửa người, ngộ độc cấp): BẮT BUỘC chọn khoa cấp cứu "dept_a9_emergency" (Tòa A9) hoặc "dept_stroke_a10" (Tòa A10), urgency="emergency", và nhắc gọi 115 / Hotline A9 086 958 7707.
3. BẠN CHỈ ĐƯỢC CHỌN suggestedDepartmentId NẰM TRONG DANH SÁCH ĐÃ XÁC MINH CỦA BỆNH VIỆN BẠCH MAI DƯỚI ĐÂY:
- "dept_a9_emergency": Trung Tâm Cấp Cứu A9 (Tòa A9) - Cấp cứu 24/7, đau ngực dữ dội, khó thở, ngất xỉu, tai nạn
- "dept_stroke_a10": Trung Tâm Đột Quỵ (Tòa A10) - Méo miệng, liệt nửa người, nói ngọng, tai biến
- "dept_poison_k3": Trung Tâm Chống Độc Quốc Gia (Tòa K3) - Ngộ độc hóa chất, rắn cắn, nấm độc, uống nhầm thuốc
- "dept_derma_k3": Khoa Da Liễu & Bỏng (Tòa K3) - Bỏng, dị ứng da, ngứa, vảy nến
- "dept_reception_k1": Sảnh Tiếp Đón & Đăng Ký Khám (Tòa K1) - Đăng ký khám BHYT, lấy số khám, hỏi thông tin chung (Thuận tiện từ Cổng 4)
- "dept_internal_k1": Phòng Khám Nội Tổng Quát (Tòa K1) - Sốt, mệt mỏi, sút cân, khám sức khỏe tổng quát
- "dept_gastro_k1": Phòng Khám Tiêu Hóa - Gan Mật (Tòa K1) - Đau dạ dày, ợ chua, viêm gan, đại tràng
- "dept_cardiology_vtm": Viện Tim Mạch Quốc Gia (Tòa VTM Khối nhà bên trái) - Tăng huyết áp, đau thắt ngực, suy tim, hồi hộp
- "dept_onco_h": Viện Y Học Hạt Nhân & Ung Bướu (Tòa H) - Tầm soát ung thư, u hạch, xạ trị, hóa trị
- "dept_tropical_f": Viện Y Học Nhiệt Đới & Phòng Tiêm Chủng (Tòa F) - Sốt xuất huyết, tiêm phòng vaccine, bệnh truyền nhiễm
- "dept_eye_dental_f": Khoa Mắt & Răng Hàm Mặt (Tòa F) - Mờ mắt, đau răng, nhổ răng khôn, sâu răng
- "dept_neuro_t1": Viện Thần Kinh (Cụm T1-T3) - Đau đầu mạn tính, rối loạn tiền đình, mất ngủ, Parkinson (Gần Cổng 3)
- "dept_mental_t4": Viện Sức Khỏe Tâm Thần (Cụm T4-T6) - Lo âu, trầm cảm, stress, rối loạn giấc ngủ (Gần Cổng 3)
- "dept_trad_d2": Khoa Y Học Cổ Truyền (Tòa D2) - Đông y, châm cứu, bấm huyệt
- "dept_rehab_d4": Viện Phục Hồi Chức Năng (Tòa D4) - Phục hồi chức năng, tập vật lý trị liệu
- "dept_allergy_d6": Trung Tâm Dị Ứng - Miễn Dịch Lâm Sàng (Tòa D6) - Dị ứng thuốc, mày đay, lupus
- "dept_pharmacy_k1": Nhà Thuốc Bệnh Viện (Tòa K1) - Lấy thuốc, mua thuốc theo đơn
- "dept_cashier_k1": Quầy Thu Viện Phí (Tòa K1) - Nộp viện phí, thanh toán BHYT

4. Nếu không rõ triệu chứng hoặc không có khoa chuyên sâu tương ứng, chọn "dept_reception_k1".
5. Trả về đúng JSON theo cấu trúc:
{
  "reply": "Lời khuyên ngắn gọn, lịch sự, ân cần kèm câu nhắc 'Gợi ý của AI không thay thế chẩn đoán của bác sĩ.'",
  "triage": {
    "suggestedDepartmentId": "id_khoa_trong_danh_sach_tren",
    "departmentName": "Tên khoa",
    "buildingId": "Mã tòa",
    "urgency": "emergency" | "urgent" | "normal",
    "instructions": ["hướng dẫn 1", "hướng dẫn 2"]
  }
}

Câu hỏi/triệu chứng của bệnh nhân: "${query}"
Vị trí hiện tại: Tòa ${currentLocation?.buildingId || "Chưa xác định"}, Tầng ${currentLocation?.floorId || "Chưa xác định"}
Ngôn ngữ phản hồi: ${language === "en" ? "English" : "Tiếng Việt"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Bạn là hệ thống AI phân luồng y tế & chỉ đường định hướng Bệnh viện Bạch Mai. Phản hồi hoàn toàn bằng JSON theo đúng schema quy định."
      }
    });

    const parsed: AITriageResponse = JSON.parse(response.text || "{}");

    // Validate that the returned suggestedDepartmentId exists in our verified list
    if (!parsed.triage || !parsed.triage.suggestedDepartmentId || !VERIFIED_BACH_MAI_DEPARTMENTS[parsed.triage.suggestedDepartmentId]) {
      const fallback = createFallbackResponse();
      parsed.triage = fallback.triage;
    } else {
      // Ensure buildingId, floorId, departmentName match verified source of truth
      const verifiedDept = VERIFIED_BACH_MAI_DEPARTMENTS[parsed.triage.suggestedDepartmentId];
      parsed.triage.departmentName = verifiedDept.name;
      parsed.triage.buildingId = verifiedDept.buildingId;
      parsed.triage.floorId = verifiedDept.floorId;
      delete parsed.triage.roomCode;
    }

    if (!parsed.reply) {
      parsed.reply = `Gợi ý đến ${parsed.triage.departmentName}. Gợi ý của AI không thay thế chẩn đoán của bác sĩ.`;
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini triage error:", error);
    return res.json(createFallbackResponse());
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MedNav Bach Mai Hospital server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
