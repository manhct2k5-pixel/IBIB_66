import { describe, it, expect } from 'vitest';
import { HOSPITAL_108_OFFICIAL_MAP_LINKS, HOSPITAL_108_DESTINATIONS, HOSPITAL_108_SOURCES } from '../data/hospital108';
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.json', '.html', '.css'].includes(ext)) {
        if (!fullPath.includes('package-lock.json') && !fullPath.includes('hospital108.test.ts')) {
          arrayOfFiles.push(fullPath);
        }
      }
    }
  });

  return arrayOfFiles;
}

describe('Bệnh viện Trung ương Quân đội 108 Data & Code Verification', () => {
  it('Không còn từ khóa Bạch Mai trong toàn bộ mã nguồn', () => {
    const rootDir = process.cwd();
    const filesToScan = [
      ...getAllFiles(path.join(rootDir, 'src')),
      path.join(rootDir, 'server.ts'),
      path.join(rootDir, 'index.html'),
      path.join(rootDir, 'metadata.json')
    ];
    
    const forbiddenKeywords = [
      'Bạch Mai',
      'Bach Mai',
      'bachmai',
      '78 Giải Phóng',
      '086 958 7707',
      'BACH_MAI_'
    ];

    filesToScan.forEach(filePath => {
      if (!fs.existsSync(filePath)) return;
      const content = fs.readFileSync(filePath, 'utf-8');
      forbiddenKeywords.forEach(keyword => {
        expect(content.includes(keyword), `Found forbidden keyword "${keyword}" in file ${filePath}`).toBe(false);
      });
    });
  });

  it('Địa chỉ chính thức phải là: Số 1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội.', () => {
    expect(HOSPITAL_108_SOURCES.address).toBe('Số 1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội.');
  });

  it('Mọi link bản đồ đều thuộc https://mapscustom.inmapz.com/customers/bv108/', () => {
    HOSPITAL_108_OFFICIAL_MAP_LINKS.forEach(link => {
      expect(link.url.startsWith('https://mapscustom.inmapz.com/customers/bv108/')).toBe(true);
    });
  });

  it('Mỗi mapLinkId trong destinations phải tồn tại trong officialMapLinks', () => {
    const validIds = HOSPITAL_108_OFFICIAL_MAP_LINKS.map(l => l.id);
    HOSPITAL_108_DESTINATIONS.forEach(dest => {
      expect(validIds.includes(dest.mapLinkId)).toBe(true);
    });
  });

  it('C1.1-A có mapPrecision là building_start_view', () => {
    const c11a = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'c1_1_a');
    expect(c11a).toBeDefined();
    expect(c11a?.mapPrecision).toBe('building_start_view');
    expect(c11a?.locationNotice).toBeDefined();
  });

  it('C1.1-B có mapPrecision là building_start_view', () => {
    const c11b = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'c1_1_b');
    expect(c11b).toBeDefined();
    expect(c11b?.mapPrecision).toBe('building_start_view');
    expect(c11b?.locationNotice).toBeDefined();
  });

  it('C1.1-C có mapPrecision là building_start_view', () => {
    const c11c = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'c1_1_c');
    expect(c11c).toBeDefined();
    expect(c11c?.mapPrecision).toBe('building_start_view');
    expect(c11c?.locationNotice).toBeDefined();
  });

  it('Khoa Cấp cứu có mapPrecision là campus_only và số 024 6278 4115', () => {
    const capcuu = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'cap_cuu');
    expect(capcuu).toBeDefined();
    expect(capcuu?.mapPrecision).toBe('campus_only');
    expect(capcuu?.description).toContain('024 6278 4115');
  });

  it('Khu Khám Đối ngoại – Quốc tế không được tuyên bố có điểm chính xác trên bản đồ (campus_only)', () => {
    const doingoai = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'kham_quoc_te');
    expect(doingoai).toBeDefined();
    expect(doingoai?.mapPrecision).toBe('campus_only');
  });

  it('Nút cấp cứu quốc gia có 115 và cấp cứu viện 108 có 024 6278 4115', () => {
    expect(HOSPITAL_108_SOURCES.nationalEmergency).toBe('115');
    expect(HOSPITAL_108_SOURCES.emergencyPhone).toBe('024 6278 4115');
  });

  it('Hotline Ban Công tác xã hội đúng số 0333 100 018', () => {
    expect(HOSPITAL_108_SOURCES.hotlines.congTacXaHoi).toBe('0333 100 018');
  });
  
  it('Các iframe phải có thuộc tính allow="geolocation" bị gỡ bỏ để không xin quyền trái phép', () => {
    const iframeCode = fs.readFileSync(path.join(process.cwd(), 'src/components/Official108Map.tsx'), 'utf-8');
    expect(iframeCode).not.toContain('allow="geolocation"');
  });
  
  it('Server hiển thị tên MedNav 108', () => {
    const serverCode = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf-8');
    expect(serverCode).toContain('MedNav 108 server running');
    expect(serverCode).not.toContain('Bach Mai');
  });
  
  it('Chữ cực nhỏ text-xs không còn trong mã nguồn chính (trừ file test)', () => {
    const srcFiles = getAllFiles(path.join(process.cwd(), 'src'));
    srcFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('text-xs');
    });
  });
  
  it('Kiểm tra rel="noopener noreferrer" trong mọi thẻ mở tab mới target="_blank"', () => {
    const srcFiles = getAllFiles(path.join(process.cwd(), 'src'));
    srcFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('target="_blank"')) {
        expect(content).toContain('rel="noopener noreferrer"');
      }
    });
  });

  it('Kiểm tra metadata.json và index.html có tên MedNav 108', () => {
    const metadata = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'metadata.json'), 'utf-8'));
    expect(metadata.name).toBe('MedNav 108');

    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
    expect(html).toContain('MedNav 108');
  });
});
