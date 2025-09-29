-- SQLite Materials Seed Data
-- This file contains INSERT statements for initial materials data
-- Compatible with SQLite syntax (INSERT OR IGNORE)

BEGIN TRANSACTION;

-- Building Materials
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-001','B-001','Batu Kali','RET',5,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-002','B-002','Pasir (Cor/Lamasi/Masamba)','RET',10,1);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-003','B-003','Timbunan + Hampar','RET',5,1);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-004','B-004','Batu Bata','PCS',1000,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-005','B-005','Semen 40 Kg','ZAK',20,1);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-006','B-006','A Plus','ZAK',10,1);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-007','B-007','Besi Ø8 Full (Tulangan)','BTG',50,3);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-008','B-008','Besi Ø6 Full (Beugel)','BTG',30,3);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-009','B-009','Kawat Pengikat','ROL',5,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-010','B-010','Papan Mal','LBR',20,5);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-011','B-011','Balok 5/3 4m','BTG',10,5);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-012','B-012','Balok 5/5 4m','BTG',10,5);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-013','B-013','Balok 5/10 4m','BTG',5,5);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-014','B-014','Tripleks Mal','LBR',10,5);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-015','B-015','Kusen Pintu, Ventilasi & Jendela','SET',5,7);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-016','B-016','Daun Pintu Dan Jendela','SET',5,7);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-017','B-017','Pintu Sliding Kamar Mandi','SET',2,7);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-018','B-018','Kaca Polos 5 cm','LS',1,3);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-019','B-019','Engsel Pintu 4"','BOX',5,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-020','B-020','Engsel Jendela 3"','BOX',5,2);

-- Paint & Finishing Materials
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-021','B-021','Cat Tembok','LS',5,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-022','B-022','Cat Kayu 5 Ltr','PCS',3,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-023','B-023','Thinner','LS',3,1);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-024','B-024','Atap Spandek Hitam 0,3','M',50,3);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-B-025','B-025','Atap GMPM 0,35','LBR',20,3);

-- Roofing Materials
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-C-001','C-001','Genteng','PCS',500,7);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-C-002','C-002','Nok Genteng','PCS',20,7);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-C-003','C-003','Lisplang','PCS',10,5);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-C-004','C-004','Talang Air','M',20,3);

-- Electrical & Plumbing
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-E-001','E-001','Kabel NYA 2.5','M',100,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-E-002','E-002','Saklar','PCS',10,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-E-003','E-003','Stop Kontak','PCS',10,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-P-001','P-001','Pipa PVC 3"','BTG',10,2);
INSERT OR IGNORE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES ('MAT-P-002','P-002','Pipa PVC 4"','BTG',10,2);

COMMIT;