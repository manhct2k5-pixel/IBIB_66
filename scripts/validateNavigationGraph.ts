import { HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES } from '../src/data/hospital108/navigation';
import { validateNavigationGraph } from '../src/services/pathfinding/graphValidator';

console.log('=====================================================');
console.log('🔍 ĐANG KIỂM TRA ĐỒ THỊ ĐIỀU HƯỚNG BỆNH VIỆN 108...');
console.log('=====================================================');

const result = validateNavigationGraph(HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES);

const prototypeNodes = HOSPITAL_108_ROUTE_NODES.filter(n => n.verificationStatus === 'prototype').length;
const prototypeEdges = HOSPITAL_108_ROUTE_EDGES.filter(e => e.verificationStatus === 'prototype').length;

console.log(`\n📊 THỐNG KÊ ĐỒ THỊ:`);
console.log(`- Tổng số Node: ${result.stats.totalNodes} (Đã xác minh: ${result.stats.verifiedNodes}, Nguyên mẫu: ${prototypeNodes})`);
console.log(`- Tổng số Cạnh: ${result.stats.totalEdges} (Đã xác minh: ${result.stats.verifiedEdges}, Nguyên mẫu: ${prototypeEdges})`);
console.log(`- Điểm đến kết nối hợp lệ: ${result.stats.destinationsConnected}`);

if (result.warnings.length > 0) {
  console.log(`\n⚠️ CẢNH BÁO (${result.warnings.length}):`);
  result.warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
}

if (!result.isValid) {
  console.error(`\n❌ PHÁT HIỆN LỖI ĐỒ THỊ (${result.errors.length}):`);
  result.errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
  process.exit(1);
} else {
  console.log(`\n✅ ĐỒ THỊ ĐIỀU HƯỚNG HỢP LỆ VÀ SẴN SÀNG SỬ DỤNG!`);
  process.exit(0);
}
