--
-- Pramétrage
--

-- Table par_region
INSERT INTO par_region VALUES (1, '01',  'Tanger-Tétouan-Al Hoceïma', 'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (2, '02',  'L''Oriental',               'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (3, '03',  'Fès - Meknès',              'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (4, '04',  'Rabat - Salé - Kénitra',    'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (5, '05',  'Béni Mellal - Khénifra',    'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (6, '06',  'Casablanca - Settat',       'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (7, '07',  'Marrakech - Safi',          'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (8, '08',  'Drâa - Tafilalet',          'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (9, '09',  'Souss - Massa',             'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (10, '10', 'Guelmim - Oued Noun',       'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (11, '11', 'Laâyoune - Sakia El Hamra', 'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO par_region VALUES (12, '12', 'Dakhla - Oued Eddahab',     'A', current_timestamp, 'admin', current_timestamp, 'admin', 0);

-- Table par_province
--INSERT INTO par_province (prv_code, prv_name, prv_status, prv_reg_id, created_date, created_by, last_updated, last_updated_by, version) VALUES
INSERT INTO par_province VALUES
(1,'0401','Kenitra',         'A',4,current_timestamp,'admin',current_timestamp,'admin',0),
(2,'0402','Khémisset',       'A',4,current_timestamp,'admin',current_timestamp,'admin',0),
(3,'0403','Rabat',           'A',4,current_timestamp,'admin',current_timestamp,'admin',0),
(4,'0404','Salé',            'A',4,current_timestamp,'admin',current_timestamp,'admin',0),
(5,'0405','Sidi Kacem',      'A',4,current_timestamp,'admin',current_timestamp,'admin',0),
(6,'0406','Sidi Slimane',    'A',4,current_timestamp,'admin',current_timestamp,'admin',0),
(7,'0407','Skhirate-Témara', 'A',4,current_timestamp,'admin',current_timestamp,'admin',0);


-- Table par_commune
INSERT INTO par_commune VALUES
(1,'040301','Rabat',          'U','A',4,3,current_timestamp,'admin',current_timestamp,'admin',0),
(2,'040302','Touarga',        'U','A',4,3,current_timestamp,'admin',current_timestamp,'admin',0),
(3,'040401','Salé',           'U','A',4,4,current_timestamp,'admin',current_timestamp,'admin',0),
(4,'040402','Sidi Bouknadel', 'U','A',4,4,current_timestamp,'admin',current_timestamp,'admin',0),
(5,'040403','Shoul',          'R','A',4,4,current_timestamp,'admin',current_timestamp,'admin',0),
(6,'040404','Ameur',          'R','A',4,4,current_timestamp,'admin',current_timestamp,'admin',0);


-- Table par_exercice
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




INSERT INTO par_convention VALUES 
(1,'CONV01','Convention 01','',null,null,current_timestamp,'admin',current_timestamp,'admin',0),
(2,'CONV02','Convention 02','',null,null,current_timestamp,'admin',current_timestamp,'admin',0);

INSERT INTO par_commanditaire VALUES 
(1,'COMD01','Commanditaire 01','',current_timestamp,'admin',current_timestamp,'admin',0),
(2,'COMD02','Commanditaire 02','',current_timestamp,'admin',current_timestamp,'admin',0);

INSERT INTO par_agent_exe VALUES 
(1,'admin','admin','A',null,1,current_timestamp,'admin',current_timestamp,'admin',0);

--
-- Plan
--

-- Table pla_budget_type
INSERT INTO pla_budget_type VALUES
(1,'BG','Budget Général',1,'A',current_timestamp,'admin',current_timestamp,'admin',0),
(2,'BH','Budget Habous',2,'A',current_timestamp,'admin',current_timestamp,'admin',0);

-- Table pla_type_operation
INSERT INTO pla_type_operation VALUES
(1,'OP01','Construction','Construction',current_timestamp,'admin',current_timestamp,'admin',0),
(2,'OP02','Reconstruction','Reconstruction',current_timestamp,'admin',current_timestamp,'admin',0),
(3,'OP03','Equipement','Equipement',current_timestamp,'admin',current_timestamp,'admin',0),
(4,'OP04','Restauration','Restauration',current_timestamp,'admin',current_timestamp,'admin',0),
(5,'OP05','Extension','Extension',current_timestamp,'admin',current_timestamp,'admin',0),
(6,'OP06','Aménagement','Aménagement',current_timestamp,'admin',current_timestamp,'admin',0);

-- Table pla_class_prestation
INSERT INTO pla_class_prestation VALUES
(1,'NP01','Travaux','Travaux',current_timestamp,'admin',current_timestamp,'admin',0),
(2,'NP02','Etude','Etude',current_timestamp,'admin',current_timestamp,'admin',0),
(3,'NP03','Fourniture','Fourniture',current_timestamp,'admin',current_timestamp,'admin',0),
(4,'NP04','Transport','Transport',current_timestamp,'admin',current_timestamp,'admin',0),
(5,'NP05','Formation','Formation',current_timestamp,'admin',current_timestamp,'admin',0),
(6,'NP06','Entretien','Entretien',current_timestamp,'admin',current_timestamp,'admin',0),
(7,'NP07','Autres','Autres',current_timestamp,'admin',current_timestamp,'admin',0);

-- Table pla_type_prestation
INSERT INTO pla_type_prestation VALUES
(1,'TP_TR01','Construction','Construction',1,current_timestamp,'admin',current_timestamp,'admin',0),
(2,'TP_TR02','Reconstruction','Reconstruction',1,current_timestamp,'admin',current_timestamp,'admin',0),
(3,'TP_TR03','Achèvement','Achèvement',1,current_timestamp,'admin',current_timestamp,'admin',0),
(4,'TP_TR04','Extension','Extension',1,current_timestamp,'admin',current_timestamp,'admin',0),
(5,'TP_TR05','Restauration','Restauration',1,current_timestamp,'admin',current_timestamp,'admin',0),
(6,'TP_ET06','Etude Géotechnique','Etude Géotechnique',2,current_timestamp,'admin',current_timestamp,'admin',0),
(7,'TP_ET07','Etude Topographique','Etude Topographique',2,current_timestamp,'admin',current_timestamp,'admin',0);


--
-- Budget
--

-- Table bud_partie
INSERT INTO bud_partie VALUES (1, '1', 'Reccete', null, current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO bud_partie VALUES (2, '2', 'Dépense', null, current_timestamp, 'admin', current_timestamp, 'admin', 0);

-- Table bud_titre
INSERT INTO bud_titre VALUES (1, '1', 'Fonctionnement', null, current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO bud_titre VALUES (2, '2', 'Investissement', null, current_timestamp, 'admin', current_timestamp, 'admin', 0);

-- Table bud_ss_titre
-- str_id, str_code, str_name, str_desc, str_ttr_id, created_date, created_by, last_updated, last_updated_by, version
INSERT INTO bud_ss_titre VALUES (1, '1', 'Dépenses personnel', null, 1, current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO bud_ss_titre VALUES (2, '2', 'Dépenses matériel et diverses', null, 1, current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO bud_ss_titre VALUES (3, '3', 'Charges communes', null, 1, current_timestamp, 'admin', current_timestamp, 'admin', 0);
INSERT INTO bud_ss_titre VALUES (4, '4', 'Dépenses imprévues', null, 1, current_timestamp, 'admin', current_timestamp, 'admin', 0);

-- Table bud_code_fnc
INSERT INTO bud_code_fnc VALUES
(42,'42','','',current_timestamp,'admin',current_timestamp,'admin',1);

-- Table bud_code_eco
INSERT INTO bud_code_eco VALUES
(811,'811','','',current_timestamp,'admin',current_timestamp,'admin',0),
(872,'872','','',current_timestamp,'admin',current_timestamp,'admin',0),
(881,'881','','',current_timestamp,'admin',current_timestamp,'admin',0),
(8211,'8211','','',current_timestamp,'admin',current_timestamp,'admin',0);

-- Table bud_chapitre
INSERT INTO bud_chapitre VALUES
(1,'1.2.2.0.0.23.000','','',1,2,2,null,current_timestamp,'admin',current_timestamp,'admin',0);


---------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------  Data for tests  -------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO pla_program VALUES 
(81,'PRG01','Programme 01','','',current_timestamp,'admin',current_timestamp,'admin',0),
(82,'PRG02','Programme 02','','',current_timestamp,'admin',current_timestamp,'admin',0);

INSERT INTO pla_project VALUES 
(83,'PRJ01-01','Projet 01-01','','',81,null,current_timestamp,'admin',current_timestamp,'admin',0),
(84,'SsPrj 01-01-001','Sous Projet 01-01-001','','',null,83,current_timestamp,'admin',current_timestamp,'admin',0),
(85,'SsPrj 01-01-002','Sous Projet 01-01-002','','',null,83,current_timestamp,'admin',current_timestamp,'admin',0),
(86,'SsPrj 01-01-003','Sous Projet 01-01-003','','',null,83,current_timestamp,'admin',current_timestamp,'admin',0),
(87,'PRJ01-02','Projet 01-02','','',81,null,current_timestamp,'admin',current_timestamp,'admin',0),
(88,'SsPrj 01-02-001','Sous Projet 01-02-001','','',null,87,current_timestamp,'admin',current_timestamp,'admin',0),
(89,'SsPrj 01-02-002','Sous Projet 01-02-002','','',null,87,current_timestamp,'admin',current_timestamp,'admin',0),
(90,'PRJ02-01','Projet 02-01','','',82,null,current_timestamp,'admin',current_timestamp,'admin',0),
(91,'SsPrj 02-01-001','Sous Projet 02-01-001','','',null,90,current_timestamp,'admin',current_timestamp,'admin',0),
(92,'SsPrj 02-01-002','Sous Projet 02-01-002','','',null,90,current_timestamp,'admin',current_timestamp,'admin',0);

INSERT INTO bud_morasse VALUES 
(12,'MOR17-01','Morasse 2017','','I',1,17,current_timestamp,'admin',current_timestamp,'admin',0),
(533,'MOR18-01','Morasse 2018','','I',1,18,current_timestamp,'admin',current_timestamp,'admin',0);

INSERT INTO 
public.bud_morasse_det(mod_id , mod_code , mod_name                                                                                            , mod_row_type , mod_article , mod_parag , mod_ss_parag , mod_ligne , mod_ss_ligne , mod_credit_cp , mod_credit_ce , mod_asm_status , mod_cp_sum , mod_ce_sum , mod_cp_eng , mod_ce_eng , mod_pex_id , mod_chp_id , mod_cfn_id , mod_cec_id , mod_mor_id , mod_mod_id , created_date              , created_by , last_updated              , last_updated_by , version)
VALUES
(14                           , '3000'   , 'Lieux cultuels et culturels'                                                                       , 'A'          , 3000        , 0         , 0            , 0         , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , null       , null       , 12         , null       , '2017-06-05 18:42:38.638' , 'admin'    , '2017-06-05 18:42:38.638' , 'admin'         , 0)       ,
(16                           , '10'     , 'Extention du réseau des lieux cultuels et culturels'                                               , 'P'          , 3000        , 10        , 0            , 0         , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , null       , null       , 12         , null       , '2017-06-05 18:44:49.248' , 'admin'    , '2017-06-05 18:44:49.248' , 'admin'         , 0)       ,
(18                           , '11'     , 'Construction et equipement des lieux cultuels et culturels'                                        , 'Q'          , 3000        , 10        , 11           , 0         , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , 42         , null       , 12         , null       , '2017-06-05 18:45:36.639' , 'admin'    , '2017-06-05 18:45:36.639' , 'admin'         , 0)       ,
(20                           , '10'     , 'Etudes'                                                                                            , 'L'          , 3000        , 10        , 11           , 10        , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , null       , null       , 12         , null       , '2017-06-05 18:47:01.704' , 'admin'    , '2017-06-05 18:47:01.704' , 'admin'         , 0)       ,
(22                           , '11'     , 'Etudes ,expertise , assistance technique et contrôle lié aux travaux de construction'              , 'M'          , 3000        , 10        , 11           , 10        , 11           , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , null       , 881        , 12         , null       , '2017-06-05 18:56:55.433' , 'admin'    , '2017-06-05 18:56:55.433' , 'admin'         , 0)       ,
(25                           , '12'     , 'Etudes ,expertise , assistance technique et contrôle lié aux travaux de construction à l''étrangé' , 'M'          , 3000        , 10        , 11           , 10        , 12           , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , null       , 881        , 12         , null       , '2017-06-05 19:04:05.181' , 'admin'    , '2017-06-05 19:04:05.181' , 'admin'         , 0)       ,
(27                           , '20'     , 'Achat de terrains'                                                                                 , 'L'          , 3000        , 10        , 11           , 20        , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 17         , 1          , null       , 811        , 12         , null       , '2017-06-05 19:08:19.133' , 'admin'    , '2017-06-05 19:08:19.133' , 'admin'         , 0)       ,
(30                           , '3000'   , 'Lieux cultuels et culturels'                                                                       , 'A'          , 3000        , 0         , 0            , 0         , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 18         , 1          , null       , null       , 533        , null       , '2017-06-05 18:42:38.638' , 'admin'    , '2017-06-05 18:42:38.638' , 'admin'         , 0)       ,
(31                           , '10'     , 'Extention du réseau des lieux cultuels et culturels'                                               , 'P'          , 3000        , 10        , 0            , 0         , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 18         , 1          , null       , null       , 533        , null       , '2017-06-05 18:44:49.248' , 'admin'    , '2017-06-05 18:44:49.248' , 'admin'         , 0)       ,
(32                           , '11'     , 'Construction et equipement des lieux cultuels et culturels'                                        , 'Q'          , 3000        , 10        , 11           , 0         , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 18         , 1          , 42         , null       , 533        , null       , '2017-06-05 18:45:36.639' , 'admin'    , '2017-06-05 18:45:36.639' , 'admin'         , 0)       ,
(33                           , '10'     , 'Etudes'                                                                                            , 'L'          , 3000        , 10        , 11           , 10        , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 18         , 1          , null       , null       , 533        , null       , '2017-06-05 18:47:01.704' , 'admin'    , '2017-06-05 18:47:01.704' , 'admin'         , 0)       ,
(34                           , '11'     , 'Etudes ,expertise, assistance technique et contrôle lié aux travaux de construction'               , 'M'          , 3000        , 10        , 11           , 10        , 11           , 5             , 15            , ''             , 0          , 0          , 0          , 0          , 18         , 1          , null       , 881        , 533        , null       , '2017-06-05 18:56:55.433' , 'admin'    , '2017-06-06 09:38:05.671' , 'admin'         , 1)       ,
(35                           , '12'     , 'Etudes ,expertise,  assistance technique et contrôle lié aux travaux de construction à l''étrangé' , 'M'          , 3000        , 10        , 11           , 10        , 12           , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 18         , 1          , null       , 881        , 533        , null       , '2017-06-05 19:04:05.181' , 'admin'    , '2017-06-05 19:04:05.181' , 'admin'         , 0)       ,
(36                           , '20'     , 'Achat de terrains'                                                                                 , 'L'          , 3000        , 10        , 11           , 20        , 0            , 0             , 0             , ''             , 0          , 0          , 0          , 0          , 18         , 1          , null       , 811        , 533        , null       , '2017-06-05 19:08:19.133' , 'admin'    , '2017-06-05 19:08:19.133' , 'admin'         , 0);


/*
delete from par_region;
delete from par_ordonateur;
delete from par_province;
delete from par_commune;
delete from par_exercice;
delete from par_convention;
delete from par_commanditaire;
delete from par_agent_exe;
delete from pla_budget_type;
delete from pla_type_operation;
delete from pla_class_prestation;
delete from pla_type_prestation;
delete from bud_partie;
delete from bud_titre;
delete from bud_ss_titre;
delete from bud_code_fnc;
delete from bud_code_eco;
delete from bud_chapitre;
delete from pla_program;
delete from pla_project;
delete from bud_morasse;
delete from bud_morasse_det;
delete from bud_ss_morasse;
delete from bud_ss_morasse_det;

*/