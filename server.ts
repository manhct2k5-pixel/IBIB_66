import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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

// AI Medical Hospital Triage & Navigation Assistant Endpoint
app.post("/api/triage", async (req, res) => {
  const { query, currentFloor, currentBuilding, language = "vi" } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing or invalid query" });
  }

  const ai = getGeminiClient();

  // If Gemini API is not available, provide structured intelligent fallback
  if (!ai) {
    return res.json({
      reply: `Dựa trên triệu chứng "${query}", bạn nên đến Quầy Tiếp Đón & Phân Loại Bệnh (Tòa A, Tầng 1) hoặc liên hệ nhân viên y tế để được thăm khám chính xác.`,
      suggestedDepartmentId: "dept_reception",
      departmentName: "Quầy Tiếp Đón & Đăng Ký Khám",
      building: "Tòa A",
      floor: "Tầng 1",
      roomCode: "A-101",
      urgency: "normal",
      instructions: [
        "Đến quầy số 1 lấy số thứ tự",
        "Xuất trình thẻ BHYT hoặc CCCD gắn chip",
        "Nhận phiếu chỉ định vào phòng khám chuyên khoa"
      ]
    });
  }

  try {
    const prompt = `Bạn là Trợ lý AI Hướng Dẫn Chỉ Đường Bệnh Viện Đa Khoa MedNav (MedNav Hospital Assistant).
Nhiệm vụ của bạn:
1. Tiếp nhận câu hỏi hoặc mô tả triệu chứng của bệnh nhân.
2. Xác định khoa khám/phòng chuyên môn phù hợp nhất trong danh sách cơ sở vật chất bệnh viện dưới đây.
3. Cung cấp câu trả lời ngắn gọn, thân thiện, ân cần (dưới 100 từ) và trả về JSON có cấu trúc để hệ thống kích hoạt chỉ đường tự động.

Danh mục khoa & phòng khám của Bệnh viện MedNav:
- Cấp Cứu 24/7 (Emergency): id="dept_emergency", Tòa A, Tầng 1, Phòng A-100 (Triệu chứng: Đau ngực dữ dội, khó thở cấp, ngất xỉu, co giật, chấn thương chảy máu nhiều, sốt co giật ở trẻ em, ngộ độc)
- Quầy Tiếp đón & Viện phí (Reception): id="dept_reception", Tòa A, Tầng 1, Phòng A-101 (Đăng ký khám, bảo hiểm y tế, đóng tiền)
- Nhà thuốc Bệnh viện (Pharmacy): id="dept_pharmacy_a", Tòa A, Tầng 1, Phòng A-108 (Lấy thuốc, mua thuốc)
- Khoa Nội Tổng Quát (Internal Medicine): id="dept_internal", Tòa A, Tầng 2, Phòng A-201 (Sốt, mệt mỏi, sụt cân, khám sức khỏe tổng quát)
- Khoa Tim Mạch (Cardiology): id="dept_cardiology", Tòa A, Tầng 2, Phòng A-204 (Hồi hộp, đánh trống ngực, tăng huyết áp, đau thắt ngực nhẹ, suy tim)
- Khoa Tiêu Hóa - Gan Mật (Gastroenterology): id="dept_gastro", Tòa A, Tầng 2, Phòng A-208 (Đau dạ dày, ợ chua, viêm gan, đại tràng, trĩ)
- Khoa Cơ Xương Khớp & Chấn thương chỉnh hình (Orthopedics): id="dept_ortho", Tòa A, Tầng 2, Phòng A-212 (Đau khớp, đau lưng, thoái hóa cột sống, bong gân, gãy xương)
- Khoa Nhi & Tiêm Chủng (Pediatrics): id="dept_pediatrics", Tòa A, Tầng 3, Phòng A-301 (Bệnh lý trẻ em dưới 16 tuổi, tiêm phòng vaccine)
- Khoa Phụ Sản (Obstetrics & Gynecology): id="dept_obgyn", Tòa A, Tầng 3, Phòng A-306 (Khám thai, phụ khoa, hiếm muộn, kế hoạch hóa)
- Khoa Tai Mũi Họng (ENT): id="dept_ent", Tòa A, Tầng 3, Phòng A-310 (Viêm xoang, đau họng, ù tai, khàn tiếng)
- Khoa Mắt (Ophthalmology): id="dept_eye", Tòa A, Tầng 4, Phòng A-401 (Mờ mắt, đau mắt đỏ, đo thị lực, đục thủy tinh thể)
- Khoa Răng Hàm Mặt (Dental): id="dept_dental", Tòa A, Tầng 4, Phòng A-405 (Đau răng, sâu răng, nhổ răng khôn, niềng răng)
- Khoa Da Liễu & Thẩm Mỹ (Dermatology): id="dept_derma", Tòa A, Tầng 4, Phòng A-410 (Mụn, dị ứng, viêm da, vảy nến, nấm da)
- Khoa Thần Kinh (Neurology): id="dept_neuro", Tòa A, Tầng 5, Phòng A-501 (Đau đầu kinh niên, chóng mặt, mất ngủ, rối loạn tiền đình, tê bì chân tay)
- Khoa Ung Bướu & Hóa Trị (Oncology): id="dept_onco", Tòa A, Tầng 5, Phòng A-508 (Tầm soát ung thư, u hạch, hóa trị)
- Khu Lấy Máu & Xét Nghiệm (Laboratory): id="dept_lab", Tòa C, Tầng 1, Phòng C-102 (Xét nghiệm máu, nước tiểu, sinh hóa)
- Chụp X-Quang Kỹ Thuật Số (X-Ray): id="dept_xray", Tòa C, Tầng 1, Phòng C-106 (Chụp X-quang phổi, xương khớp)
- Chụp Cắt Lớp Vi Tính CT & Chụp MRI: id="dept_mri_ct", Tòa C, Tầng 2, Phòng C-202 (Chụp CT, MRI sọ não, cột sống)
- Nội Soi Tiêu Hóa & Siêu Âm 4D: id="dept_endoscopy_us", Tòa C, Tầng 3, Phòng C-301 (Nội soi dạ dày, đại tràng, siêu âm màu)
- Căn Tin & Tiện Ích: id="dept_canteen", Tòa A, Tầng B1, Phòng A-B101 (Ăn uống, nghỉ ngơi, ATM)

Câu hỏi người bệnh: "${query}"
Vị trí hiện tại của bệnh nhân: ${currentBuilding || "Tòa A"}, ${currentFloor || "Tầng 1"}
Ngôn ngữ phản hồi: ${language === "en" ? "English" : "Tiếng Việt"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Bạn là hệ thống AI phân luồng y tế & chỉ đường thông minh cho bệnh viện. Phản hồi hoàn toàn bằng định dạng JSON chuẩn theo schema: { reply: string, suggestedDepartmentId: string, departmentName: string, building: string, floor: string, roomCode: string, urgency: 'emergency'|'urgent'|'normal', instructions: string[] }."
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini triage error:", error);
    return res.json({
      reply: `Chúng tôi gợi ý bạn đến Quầy Tiếp Đón (Tòa A, Tầng 1) để được hướng dẫn chi tiết cho triệu chứng: "${query}".`,
      suggestedDepartmentId: "dept_reception",
      departmentName: "Quầy Tiếp Đón & Đăng Ký Khám",
      building: "Tòa A",
      floor: "Tầng 1",
      roomCode: "A-101",
      urgency: "normal",
      instructions: [
        "Đến sảnh chính Tòa A Tầng 1",
        "Nhận tư vấn trực tiếp từ điều dưỡng tiếp đón"
      ]
    });
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
    console.log(`MedNav Hospital server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
