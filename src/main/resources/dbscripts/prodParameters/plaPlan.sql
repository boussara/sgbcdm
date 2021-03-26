INSERT INTO public.pla_plan( pla_id, pla_code, pla_name, pla_desc, pla_date_begin, pla_date_end, pla_status, version)
VALUES 
(0, 'PL0', 'Plan 0', '', '1994-01-01 00:00:00.000', '2011-12-31 00:00:00.000', '', 0),
(1, 'PL1', 'Plan quinquennal 1', '', '2012-01-01 00:00:00.000', '2016-12-31 00:00:00.000', '', 0),
(2, 'PL2', 'Plan quinquennal 2', '', '2017-01-01 00:00:00.000', '2021-12-31 00:00:00.000', '',  0);






INSERT INTO 
par_exercice( pex_id, pex_code, pex_name, pex_desc, pex_start_date, pex_end_date,  pex_status,  version)
VALUES 
(94,'1994','Exercice 1994','','1994-01-01 00:00:00','1994-12-31 00:00:00','','0'),
(95,'1995','Exercice 1995','','1995-01-01 00:00:00','1995-12-31 00:00:00','','0'),
(96,'1996','Exercice 1996','','1996-01-01 00:00:00','1996-12-31 00:00:00','','0'),
(97,'1997','Exercice 1997','','1997-01-01 00:00:00','1997-12-31 00:00:00','','0'),
(98,'1998','Exercice 1998','','1998-01-01 00:00:00','1998-12-31 00:00:00','','0'),
(99,'1999','Exercice 1999','','1999-01-01 00:00:00','1999-12-31 00:00:00','','0'),
(2000,'2000','Exercice 2000','','2000-01-01 00:00:00','2000-12-31 00:00:00','','0'),
(01,'2001','Exercice 2001','','2001-01-01 00:00:00','2001-12-31 00:00:00','','0'),
(02,'2002','Exercice 2002','','2002-01-01 00:00:00','2002-12-31 00:00:00','','0'),
(03,'2003','Exercice 2003','','2003-01-01 00:00:00','2003-12-31 00:00:00','','0'),
(04,'2004','Exercice 2004','','2004-01-01 00:00:00','2004-12-31 00:00:00','','0'),
(05,'2005','Exercice 2005','','2005-01-01 00:00:00','2005-12-31 00:00:00','','0'),
(06,'2006','Exercice 2006','','2006-01-01 00:00:00','2006-12-31 00:00:00','','0'),
(07,'2007','Exercice 2007','','2007-01-01 00:00:00','2007-12-31 00:00:00','','0'),
(08,'2008','Exercice 2008','','2008-01-01 00:00:00','2008-12-31 00:00:00','','0'),
(09,'2009','Exercice 2009','','2009-01-01 00:00:00','2009-12-31 00:00:00','','0'),
(10,'2010','Exercice 2010','','2010-01-01 00:00:00','2010-12-31 00:00:00','','0'),
(11,'2011','Exercice 2011','','2011-01-01 00:00:00','2011-12-31 00:00:00','','0'),
(12,'2012','Exercice 2012','','2012-01-01 00:00:00','2012-12-31 00:00:00','','0'),
(13,'2013','Exercice 2013','','2013-01-01 00:00:00','2013-12-31 00:00:00','','0'),
(14,'2014','Exercice 2014','','2014-01-01 00:00:00','2014-12-31 00:00:00','','0'),
(15,'2015','Exercice 2015','','2015-01-01 00:00:00','2015-12-31 00:00:00','','0'),
(16,'2016','Exercice 2016','','2016-01-01 00:00:00','2016-12-31 00:00:00','','0'),
(17,'2017','Exercice 2017','','2017-01-01 00:00:00','2017-12-31 00:00:00','','0'),
(18,'2018','Exercice 2018','','2018-01-01 00:00:00','2018-12-31 00:00:00','','0'),
(19,'2019','Exercice 2019','','2019-01-01 00:00:00','2019-12-31 00:00:00','','0'),
(20,'2020','Exercice 2020','','2020-01-01 00:00:00','2020-12-31 00:00:00','','0'),
(21,'2021','Exercice 2021','','2021-01-01 00:00:00','2021-12-31 00:00:00','','0');




INSERT INTO pla_plan_exercice (pex_pla_id, pla_pex_id) 
VALUES 
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(0, 94),
(0, 95),
(0, 96),
(0, 97),
(0, 98),
(0, 99),
(0, 2000),
(0, 1),
(0, 2),
(0, 3),
(0, 4),
(0, 5),
(0, 6),
(0, 7),
(0, 8),
(0, 9),
(0, 10),
(0, 11);




INSERT INTO 
par_region( reg_id, reg_code, reg_name, reg_status, version)
VALUES 
(1, '01',  'Tanger-Tétouan-Al Hoceïma', 'A', 0),
(2, '02',  'L''Oriental',               'A', 0),
(3, '03',  'Fès - Meknès',              'A', 0),
(4, '04',  'Rabat - Salé - Kénitra',    'A', 0),
(5, '05',  'Béni Mellal - Khénifra',    'A', 0),
(6, '06',  'Casablanca - Settat',       'A', 0),
(7, '07',  'Marrakech - Safi',          'A', 0),
(8, '08',  'Drâa - Tafilalet',          'A', 0),
(9, '09',  'Souss - Massa',             'A', 0),
(10, '10', 'Guelmim - Oued Noun',       'A', 0),
(11, '11', 'Laâyoune - Sakia El Hamra', 'A', 0),
(12, '12', 'Dakhla - Oued Eddahab',     'A', 0);

INSERT INTO 
par_province( prv_id, prv_code, prv_name, prv_status, prv_reg_id, version)
VALUES 
(1,'0401','Kenitra',         'A',4,0),
(2,'0402','Khémisset',       'A',4,0),
(3,'0403','Rabat',           'A',4,0),
(4,'0404','Salé',            'A',4,0),
(5,'0405','Sidi Kacem',      'A',4,0),
(6,'0406','Sidi Slimane',    'A',4,0),
(7,'0407','Skhirate-Témara', 'A',4,0);

INSERT INTO 
par_commune( com_id, com_code, com_name, com_type, com_status, com_prv_id, com_reg_id, version)
VALUES
(1,'040301','Rabat',          'U','A',3,4,0),
(2,'040302','Touarga',        'U','A',3,4,0),
(3,'040401','Salé',           'U','A',4,4,0),
(4,'040402','Sidi Bouknadel', 'U','A',4,4,0),
(5,'040403','Shoul',          'R','A',4,4,0),
(6,'040404','Ameur',          'R','A',4,4,0);


