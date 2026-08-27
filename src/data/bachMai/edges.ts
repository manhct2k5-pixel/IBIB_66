import { MapEdge } from '../../types';

export const BACH_MAI_EDGES: MapEdge[] = [
  // ================= CỔNG 4 & CỤM K1, K2 =================
  {
    fromNodeId: 'node_gate_4',
    toNodeId: 'node_path_junction_k1_k2',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Lối vào chính Tòa K1 và K2 từ Cổng 4 đường Giải Phóng'
  },
  {
    fromNodeId: 'node_gate_4',
    toNodeId: 'node_path_giai_phong_south',
    distance: 30,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_junction_k1_k2',
    toNodeId: 'node_k1_entrance',
    distance: 20,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Sảnh chính đón tiếp Tòa nhà K1'
  },
  {
    fromNodeId: 'node_path_junction_k1_k2',
    toNodeId: 'node_k2_entrance',
    distance: 30,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_junction_k1_k2',
    toNodeId: 'node_path_central_axis',
    distance: 40,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },

  // ================= BÊN TRONG TÒA K1 (TẦNG 1 & TẦNG 2) =================
  {
    fromNodeId: 'node_k1_entrance',
    toNodeId: 'node_k1_reception',
    distance: 10,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Quầy tiếp đón và đăng ký khám BHYT Tòa K1'
  },
  {
    fromNodeId: 'node_k1_entrance',
    toNodeId: 'node_k1_cashier',
    distance: 12,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_k1_entrance',
    toNodeId: 'node_k1_pharmacy',
    distance: 15,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_k1_entrance',
    toNodeId: 'node_k1_elev_1',
    distance: 15,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Khu vực thang máy Tòa K1'
  },
  {
    fromNodeId: 'node_k1_entrance',
    toNodeId: 'node_k1_stairs_1',
    distance: 14,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_k1_elev_1',
    toNodeId: 'node_k1_elev_2',
    distance: 4,
    type: 'elevator',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Thang máy di chuyển giữa Tầng 1 và Tầng 2'
  },
  {
    fromNodeId: 'node_k1_stairs_1',
    toNodeId: 'node_k1_stairs_2',
    distance: 10,
    type: 'stairs',
    isAccessible: false,
    hasSteps: true,
    audioLandmarkVi: 'Cầu thang bộ lên Tầng 2 Tòa K1'
  },
  {
    fromNodeId: 'node_k1_elev_2',
    toNodeId: 'node_k1_internal_clinic',
    distance: 12,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_k1_elev_2',
    toNodeId: 'node_k1_gastro_clinic',
    distance: 14,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_k1_stairs_2',
    toNodeId: 'node_k1_internal_clinic',
    distance: 12,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_k1_stairs_2',
    toNodeId: 'node_k1_gastro_clinic',
    distance: 14,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },

  // ================= CỔNG 1, CỔNG 2 & CỤM K3, A9, A10, A11 =================
  {
    fromNodeId: 'node_gate_1',
    toNodeId: 'node_path_junction_a9_k3',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Lối vào Cổng 1 đường Giải Phóng hướng tới Cấp cứu A9 và Chống độc K3'
  },
  {
    fromNodeId: 'node_gate_1',
    toNodeId: 'node_path_giai_phong_south',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_gate_2',
    toNodeId: 'node_path_giai_phong_south',
    distance: 15,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_junction_a9_k3',
    toNodeId: 'node_k3_poison_entrance',
    distance: 15,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Trung tâm Chống độc Quốc gia Tòa K3'
  },
  {
    fromNodeId: 'node_k3_poison_entrance',
    toNodeId: 'node_k3_derma_entrance',
    distance: 10,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_junction_a9_k3',
    toNodeId: 'node_a9_emergency_entrance',
    distance: 30,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Sảnh đón tiếp Cấp cứu 24/7 Tòa A9'
  },
  {
    fromNodeId: 'node_a9_emergency_entrance',
    toNodeId: 'node_a10_stroke_entrance',
    distance: 20,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Trung tâm Đột quỵ Tòa A10'
  },
  {
    fromNodeId: 'node_a10_stroke_entrance',
    toNodeId: 'node_a11_hall_entrance',
    distance: 20,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_a9_emergency_entrance',
    toNodeId: 'node_path_central_axis',
    distance: 35,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },

  // ================= TRỤC TRUNG TÂM NỐI VTM, P, Q, B2 =================
  {
    fromNodeId: 'node_path_central_axis',
    toNodeId: 'node_vtm_entrance',
    distance: 45,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Viện Tim Mạch Quốc Gia (Khối nhà bên trái)'
  },
  {
    fromNodeId: 'node_path_central_axis',
    toNodeId: 'node_p_vietnhat_entrance',
    distance: 30,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Khu Nhà P (Tòa Nhà Việt - Nhật)'
  },
  {
    fromNodeId: 'node_path_central_axis',
    toNodeId: 'node_q_21story_entrance',
    distance: 40,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Tòa nhà Q 21 Tầng trung tâm'
  },
  {
    fromNodeId: 'node_path_central_axis',
    toNodeId: 'node_b2_admin_entrance',
    distance: 35,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },

  // ================= CỔNG 3 & CỤM T1-T6, H, F =================
  {
    fromNodeId: 'node_gate_3',
    toNodeId: 'node_path_phuong_mai_east',
    distance: 20,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Cổng số 3 đường Phương Mai vào khu Thần kinh, Tâm thần, Ung bướu'
  },
  {
    fromNodeId: 'node_path_phuong_mai_east',
    toNodeId: 'node_t4_mental_entrance',
    distance: 20,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Viện Sức khỏe tâm thần (Cụm T4-T6)'
  },
  {
    fromNodeId: 'node_path_phuong_mai_east',
    toNodeId: 'node_t1_neuro_entrance',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Viện Thần kinh (Cụm T1-T3)'
  },
  {
    fromNodeId: 'node_path_phuong_mai_east',
    toNodeId: 'node_h_onco_entrance',
    distance: 35,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Viện Y học hạt nhân & Ung bướu Tòa H'
  },
  {
    fromNodeId: 'node_h_onco_entrance',
    toNodeId: 'node_q_21story_entrance',
    distance: 35,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_phuong_mai_east',
    toNodeId: 'node_f_tropical_entrance',
    distance: 50,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Viện Y học nhiệt đới & Tiêm chủng Tòa F'
  },

  // ================= TRỤC TÂY BẮC (D2, D4, D5, D6, E) =================
  {
    fromNodeId: 'node_b2_admin_entrance',
    toNodeId: 'node_path_north_west',
    distance: 30,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_north_west',
    toNodeId: 'node_e_infection_entrance',
    distance: 30,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_north_west',
    toNodeId: 'node_f_tropical_entrance',
    distance: 40,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_f_tropical_entrance',
    toNodeId: 'node_f_eye_dental_entrance',
    distance: 10,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_path_north_west',
    toNodeId: 'node_d6_allergy_entrance',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Trung tâm Dị ứng - Miễn dịch lâm sàng Tòa D6'
  },
  {
    fromNodeId: 'node_d6_allergy_entrance',
    toNodeId: 'node_d5_training_entrance',
    distance: 20,
    type: 'walk',
    isAccessible: true,
    hasSteps: false
  },
  {
    fromNodeId: 'node_d5_training_entrance',
    toNodeId: 'node_d2_trad_entrance',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Khoa Y học cổ truyền Tòa D2'
  },
  {
    fromNodeId: 'node_d5_training_entrance',
    toNodeId: 'node_d4_rehab_entrance',
    distance: 25,
    type: 'walk',
    isAccessible: true,
    hasSteps: false,
    audioLandmarkVi: 'Viện Phục hồi chức năng Tòa D4'
  }
];
