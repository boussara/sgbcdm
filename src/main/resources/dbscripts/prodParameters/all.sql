INSERT INTO ach_mode_pass (amp_id, amp_code, amp_name, "version")
VALUES
(1, 'MP01', 'Appel d''offre ouvert', 0),
(2, 'MP02', 'Appel d''offre restreint', 0),
(3, 'MP03', 'Appel d''offre avec présélection', 0),
(4, 'MP04', 'Consultation', 0),
(5, 'MP05', 'Consultation architecturale', 0),
(6, 'MP06', 'Concour', 0),
(7, 'MP07', 'Concour architectural', 0),
(8, 'MP08', 'Procédure négociée', 0),
(9, 'MP09', 'Convention', 0),
(10, 'MP10', 'Subvention', 0);










INSERT INTO ach_sstype_depense (ast_id, ast_code, ast_name, ast_atd_id, "version")
VALUES
(0101, 'T0101', 'MARCHE CADRE EN VALEUR', 1, 0),
(0102, 'T0102', 'MARCHE CADRE', 1, 0),
(0103, 'T0103', 'MARCHE ALLOTI', 1, 0),
(0104, 'T0104', 'MARCHE RECONDUCTIBLE', 1, 0),
(0105, 'T0105', 'MARCHE A TRANCHES CONDITIONNELLES', 1, 0),
(0106, 'T0106', 'MARCHE PRESTATIONS ARCHITECTURALLES', 1, 0),
(0107, 'T0107', 'MARCHE UNIQUE', 1, 0),
(0108, 'T0108', 'MARCHE PRESTATIONS ARCHITECTURALLES - LOTISSEMENT', 1, 0),
(0201, 'T0201', 'BON DE COMMANDE', 2, 0),
(0301, 'T0301', 'SUBVENTION AUX PERSONNES PHYSIQUES', 3, 0),
(0302, 'T0302', 'SUBVENTION AU SEGMA', 3, 0),
(0303, 'T0303', 'SUBVENTION AUX ASSOCIATIONS', 3, 0),
(0304, 'T0304', 'SUBVENTION AUX INSTITUTS ET ETABLISSEMENTS DE RECHERCHES', 3, 0),
(0305, 'T0305', 'SUBVENTION AUX OFFICES', 3, 0),
(0306, 'T0306', 'SUBVENTION AUX SOCIETES', 3, 0),
(0307, 'T0307', 'SUBVENTION AUX ETABLISSEMENTS PUBLICS', 3, 0),
(0401, 'T0401', 'CONVENTION MEDECIN CONVENTIONNE', 4, 0),
(0402, 'T0402', 'AUTRES CONVENTIONS', 4, 0),
(0403, 'T0403', 'CONVENTIONS AVEC LES ASSOCIATIONS', 4, 0),
(0404, 'T0404', 'CONVENTIONS AVEC LES SOCIETES', 4, 0),
(0405, 'T0405', 'CONVENTIONS AVEC LES OFFICES', 4, 0),
(0406, 'T0406', 'CONVENTIONS AVEC LES ORGANISATIONS INTERNATIONALES', 4, 0),
(0407, 'T0407', 'CONVENTIONS AVEC LES INSTITUTS ET LES ETABLISSEMENTS PUBLICS', 4, 0),
(0501, 'T0501', 'CONTRAT D''ARCHITECTE', 5, 0),
(0601, 'T0601', 'VERSEMENT AUX SEGMA', 6, 0),
(0602, 'T0602', 'VERSEMENT', 6, 0),
(0603, 'T0603', 'VERSEMENT AUX CST', 6, 0),
(0604, 'T0604', 'PRIME SUITE A UN CONCOURS', 6, 0),
(0605, 'T0605', 'RESTITUTIONS DES SOMMES INDUMENT AU COMPTE SPECIAL', 6, 0),
(0701, 'T0701', 'GESTION DU PAIEMENT MULTICANAL', 7, 0),
(0702, 'T0702', 'ACQUISITION DES VIGNETTES POUR FRAIS DE TRANSPORT DES VALISES DIPLOMATIQUES', 7, 0),
(0703, 'T0703', 'HEBERGEMENT ET INFOGERENCE DES SYSTEMES D4INFORMATION', 7, 0),
(0704, 'T0704', 'ACTES DE LOCATION D''IMMEUBLES', 7, 0),
(0705, 'T0705', 'ACHAT ET ABONNEMENT AUX JOURNAUX, REVUES ET PUBLICATIONS DIVERSES', 7, 0),
(0706, 'T0706', 'ASSURANCE DES VEHICULES DU PARC AUTOMOBILE DES ADMINISTRATIONS PUBLIQUES', 7, 0),
(0707, 'T0707', 'ASSURANCE D''OBJETS D''ART, D''ANTIQUITE, DE COLLECTION ET DE MANUSCRITS', 7, 0),
(0708, 'T0708', 'HOTELLERIE, HEBERGEMENT, RECEPTION ET RESTAURATION', 7, 0),
(0709, 'T0709', 'CONTRAT D''ENTRETIEN DU MOBILIER ET MATERIEL', 7, 0),
(0710, 'T0710', 'DIRECTION, ANIMATION ET PARTICIPATION DES ARTISTES, INTELECTUELS, CONFERENCIERS ET TECHNICIENS DANS LES MANIFESTATIONS ET ACTIVITES CULTURELLES', 7, 0),
(0711, 'T0711', 'ACHAT DE VEHICULES ET D''ENGINS', 7, 0),
(0712, 'T0712', 'ASSURANCES DE ELEVES', 7, 0),
(0713, 'T0713', 'GESTION DE PAIEMENT MULTICANAL', 7, 0),
(0714, 'T0714', 'ASSISTANCE D''EXPERTS POUR L''EVALUATION DES DEGATS PRODUITS SUITE A DES EVENEMENTS EXCEPTIONNELS', 7, 0),
(0715, 'T0715', 'PRESTATION EFFECTUEES ENTRE SERVICES DE L''ETAT GERES DE MANIÈRE AUTONOME ET ADMINISTRATIONS PUBLIQUES', 7, 0),
(0716, 'T0716', 'TRANSPORT DES DELEGATIONS MAROCAINES D''ENCADREMENT DES PELERINS MAROCAINS AU HADJ PAR VOIE AERIENNE', 7, 0),
(0717, 'T0717', 'ABONNEMENT AUX RESEAUX DE TELECOMMUNICATION', 7, 0),
(0718, 'T0718', 'ABONNEMENT AUX SERVICES INTERNET', 7, 0),
(0719, 'T0719', 'ABONNEMENT D''ACCES A DES BASES DE DONNEES EN LIGNE', 7, 0),
(0801, 'T0801', 'INDEMNITES DES PREDICATEURS A L''INTERIEUR DU ROYAUME', 8, 0),
(0802, 'T0802', 'SALAIRE', 8, 0),
(0803, 'T0803', 'ALLOCATIONS', 8, 0),
(0804, 'T0804', 'PRIMES', 8, 0),
(0805, 'T0805', 'COTISATIONS SALARIALES ET PATRONALES', 8, 0),
(0806, 'T0806', 'HONORAIRES', 8, 0),
(0807, 'T0807', 'RETRIBUTIONS', 8, 0),
(0808, 'T0808', 'BOURSES', 8, 0),
(0809, 'T0809', 'VACATIONS', 8, 0),
(0810, 'T0810', 'INDEMNITE DE STAGE', 8, 0),
(0811, 'T0811', 'INDEMNITE FORFAITAIRE POUR UTILISATION DE VEHICULE PERSONNEL', 8, 0),
(0812, 'T0812', 'INDEMNITE DE DEPLACEMENT', 8, 0),
(0813, 'T0813', 'INDEMNITE KILOMETRIQUE', 8, 0),
(0814, 'T0814', 'INDEMNITE DE MISSION A L''ETRANGER', 8, 0),
(0815, 'T0815', 'INDEMNITE D''AIDE AU LOGEMENT', 8, 0),
(0816, 'T0816', 'INDEMNITE DE CAISSE', 8, 0),
(0817, 'T0817', 'INDEMNITE D''ABATTAGE DES ANIMAUX', 8, 0),
(0819, 'T0819', 'INDEMNITE DE NUIT', 8, 0),
(0901, 'T0901', 'EXPROPRIATION', 9, 0),
(1001, 'T1001', 'IMPOTS ET TAXES', 10, 0),
(1101, 'T1101', 'RISTOURNES D''INTERET', 11, 0),
(1201, 'T1201', 'INSERSTION PUBLICITAIRES', 12, 0),
(1301, 'T1301', 'PELERINAGE A LA MECQUE', 13, 0),
(1302, 'T1302', 'ACHAT DE MOUTONS A L''OCCASION DE LA FETE DE L''AID EL KEBIR', 13, 0),
(1303, 'T1303', 'FRAIS DE DEPLACEMENTS ET DE TOURNEES', 13, 0),
(1304, 'T1304', 'FRAIS DE SEJOURS DE COOPERANTS ETRANGERS', 13, 0),
(1401, 'T1401', 'BON DE COMMANDE SPECIFIQUE', 14, 0),
(1501, 'T1501', 'COTISATIONS DU MAROC AUX ORGANISMES INTERNATIONNAUX', 15, 0),
(1601, 'T1601', 'CAPITAL DECES', 16, 0),
(1701, 'T1701', 'DECISIONSRAJUDICIAIRES ET ADMINISTRATIVES', 17, 0),
(1801, 'T1801', 'AQCUISITIONS IMMOBILIERES A L''AMIABLE', 18, 0),
(1901, 'T1901', 'INTERETS ET COMMISSIONS BANCAIRES', 19, 0);
















































































INSERT INTO ach_type_depense (atd_id, atd_code, atd_name, "version")
VALUES
( 1, 'T01', 'Marché', 0),
( 2, 'T02', 'Bon de commande', 0),
( 3, 'T03', 'Subvention', 0),
( 4, 'T04', 'Convention', 0),
( 5, 'T05', 'Contrat d''architecte', 0),
( 6, 'T06', 'Versement', 0),
( 7, 'T07', 'Contrat de droit commun', 0),
( 8, 'T08', 'Salaires et Indemnités', 0),
( 9, 'T09', 'Expropriation', 0),
(10, 'T10', 'Impots et taxes', 0),
(11, 'T11', 'Ristournes d''interet', 0),
(12, 'T12', 'Inserstion publicitaires', 0),
(13, 'T13', 'Avances', 0),
(14, 'T14', 'Bon de commande spécifique', 0),
(15, 'T15', 'Cotisation du Maroc aux ogranismes internatinnaux', 0),
(16, 'T16', 'CAPITAL DECES', 0),
(17, 'T17', 'DECISIONS JUDICIAIRES ET ADMINISTRATIVES', 0),
(18, 'T18', 'ACQUISITIONS IMMOBILIERES A L''AMIABLE', 0),
(19, 'T19', 'INTERETS ET COMMISSIONS BANCAIRES', 0);








INSERT INTO par_type_benif(ben_id, ben_code, ben_name, "version")
VALUES
(  1, 'B01', 'Entreprise Nationale/Etablissement Public', 0),
(  2, 'B02', 'Entreprise Etrangere', 0),
(  3, 'B03', 'SEGMA', 0),
(  4, 'B04', 'Colectivite locale', 0),
(  5, 'B05', 'CoBtes particuliers', 0),
(  6, 'B06', 'Beneficiare identifie par CIN', 0),
(  7, 'B07', 'Organisme international', 0),
(  8, 'B08', 'Association', 0),
(  9, 'B09', 'CST', 0),
( 10, 'B10', 'Comptable', 0),
( 11, 'B11', 'Groupement', 0);












INSERT INTO pla_budget_type (bdt_id, bdt_code, bdt_name, bdt_ordre, bdt_status, "version")
VALUES
(1, 'BG', 'BUDGET GENERAL DE L’ETAT', 1, 'A',  0),
(2, 'BH', 'BUDGET HABOUS', 2, 'A',  0),
(3, 'FSHPNAIM', 'PLAN NATIONAL  D’ACTION  DES IMAMS MOURCHIDINE', 3, 'A',  0),
(4, 'FSHMNM', 'MISE A NIVEAU DES MOSQUEES ', 4, 'A',  0),
(5, 'FSHTFHB', 'TESTAMENT DU FEU HAJ BENNANI', 5, 'A',  0),
(6, 'FSHPFIM', 'PROGRAMME DE FORMATION DES IMAMS MALIENS', 6, 'A',  0),
(7, 'MC', 'MECENES', 7, 'A',  0);

INSERT INTO pla_class_prestation (prc_id, prc_code, prc_name, prc_desc, "version")
VALUES
( 1, 'NP01', 'Travaux', 'Travaux', 0),
( 2, 'NP02', 'Etude', 'Etude', 0),
( 3, 'NP03', 'Fourniture', 'Fourniture', 0),
( 4, 'NP04', 'Service', 'Service', 0);














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
INSERT INTO pla_program (prg_id, prg_code, prg_name, prg_desc, prg_status, "version")
VALUES
( 1, 'PR1', 'Lieux cultuels et culturels', 'Lieux cultuels et culturels', '', 0),
( 2, 'PR2', 'Préposés religieux', 'Préposés religieux', '', 0);



INSERT INTO pla_project (prj_id, prj_code, prj_name, prj_desc, prj_status, prj_prg_id, prj_prj_id, "version")
VALUES
( 1, 'PA1', 'EXTENSION DU RÉSEAU DES LIEUX CULTUELS ET CULTURELS', 'EXTENSION DU RÉSEAU DES LIEUX CULTUELS ET CULTURELS', '', 1, null, 0),
( 2, 'PA2', 'MAINTENANCE ET AMÉLIORATION DE LA QUALITÉ DES LIEUX CULTUELS ET CULTURELS', 'MAINTENANCE ET AMÉLIORATION DE LA QUALITÉ DES LIEUX CULTUELS ET CULTURELS', '', 1, null, 0),
( 3, 'PA3', 'CONSERVATION DES LIEUX CULTUELS ET CULTURELS HISTORIQUES', 'CONSERVATION DES LIEUX CULTUELS ET CULTURELS HISTORIQUES', '', 1, null, 0),
( 4, 'PA4', 'SOUTIEN DES MISSIONS', 'SOUTIEN DES MISSIONS', '', 1, null, 0);





INSERT INTO pla_src_finance (srf_id, srf_code, srf_name, srf_desc, "version")
VALUES
(1, '1', 'FINANCEMENT DE L’ETAT', 'FINANCEMENT DE L’ETAT', 0),
(2, '2', 'FINANCEMENT DES HABOUS', 'FINANCEMENT DES HABOUS', 0),
(3, '3', 'FINANCEMENT DES BIENFAITEURS', 'FINANCEMENT DES BIENFAITEURS', 0),
(4, '4', 'FINANCEMENT ROYAL', 'FINANCEMENT ROYAL', 0);












INSERT INTO pla_project (prj_id, prj_code, prj_name, prj_desc, prj_status, prj_prg_id, prj_prj_id, "version")
VALUES
( 11, 'SPA11', 'CONSTRUCTION ET AMÉNAGEMENT DES MOSQUÉES ET DE LEURS DÉPENDANCES ET DES MSSALA', 'CONSTRUCTION ET AMÉNAGEMENT DES MOSQUÉES ET DE LEURS DÉPENDANCES ET DES MSSALA', '', 1, 1, 0),
( 21, 'SPA21', 'MISE À NIVEAU DES MOSQUÉES', 'MISE À NIVEAU DES MOSQUÉES', '', 1, 2, 0),
( 22, 'SPA22', 'EQUIPEMENT DES MOSQUÉES ET DE LEURS DÉPENDANCES ET DES MSALLAS', 'EQUIPEMENT DES MOSQUÉES ET DE LEURS DÉPENDANCES ET DES MSALLAS', '', 1, 2, 0),
( 23, 'SPA23', 'PROTECTION DES MOSQUÉES CONTRE LES INCENDIES ET LA PANIQUE', 'PROTECTION DES MOSQUÉES CONTRE LES INCENDIES ET LA PANIQUE', '', 1, 2, 0),
( 24, 'SPA24', 'EFFICACITÉ ÉNERGITIQUE DANS LES MOSQUÉES', 'EFFICACITÉ ÉNERGITIQUE DANS LES MOSQUÉES', '', 1, 2, 0),
( 25, 'SPA25', 'APPROVISIONNEMENT EN EAU POTABLE ET ASSAINISSEMENT DES ÉCOLES RURALES, DES ÉCOLES DE L''ENSEIGNEMENT TRADITIONNEL ET DES MOSQUÉES', 'APPROVISIONNEMENT EN EAU POTABLE ET ASSAINISSEMENT DES ÉCOLES RURALES, DES ÉCOLES DE L''ENSEIGNEMENT TRADITIONNEL ET DES MOSQUÉES', '', 1, 2, 0),
( 26, 'SPA26', 'GÉNÉRALISATION DU BRANCHEMENT DES MOSQUÉES EN ÉLECTRICITÉ, EN EAU POTABLE ET EN ASSAINISSEMENT', 'GÉNÉRALISATION DU BRANCHEMENT DES MOSQUÉES EN ÉLECTRICITÉ, EN EAU POTABLE ET EN ASSAINISSEMENT', '', 1, 2, 0),
( 27, 'SPA27', 'MAINTENANCE ET DE GESTION DES MOSQUÉES ET DE LEURS DÉPENDANCES', 'MAINTENANCE ET DE GESTION DES MOSQUÉES ET DE LEURS DÉPENDANCES', '', 1, 2, 0),
( 31, 'SPA31', 'CONSERVATION DES MOSQUÉES HISTORIQUES', 'CONSERVATION DES MOSQUÉES HISTORIQUES', '', 1, 3, 0),
( 41, 'SPA41', 'SOUTIEN DES MISSIONS', 'SOUTIEN DES MISSIONS', '', 1, 4, 0);










INSERT INTO pla_type_operation (top_id, top_code, top_name, top_desc, "version")
VALUES
( 1, 'TOP01', 'Construction', 'Construction', 0),
( 2, 'TOP02', 'Reconstruction', 'Reconstruction', 0),
( 3, 'TOP03', 'Extention', 'Extention', 0),
( 4, 'TOP04', 'Aménagement', 'Aménagement', 0),
( 5, 'TOP05', 'Restauration', 'Restauration', 0),
( 6, 'TOP06', 'Démolition', 'Démolition', 0),
( 7, 'TOP07', 'Réhabilitation', 'Réhabilitation', 0),
( 8, 'TOP08', 'Equipement', 'Equipement', 0),
( 9, 'TOP09', 'Achévement', 'Achévement', 0),
( 10, 'TOP10', 'Renforcement', 'Renforcement', 0),
( 11, 'TOP11', 'Fourniture', 'Fourniture', 0),
( 12, 'TOP12', 'Service', 'Service', 0),
( 13, 'TOP13', 'Maintenance et gestion', 'Maintenance et gestion', 0);












INSERT INTO pla_type_prestation (prt_id, prt_code, prt_name, prt_desc, prt_prc_id, "version")
VALUES
( 1, 'TP01', 'Travaux', 'Travaux', 1, 0),
( 2, 'TP02', 'Etude Topographique', 'Etude Topographique', 2, 0),
( 3, 'TP03', 'Etude Géographique', 'Etude Géographique', 2, 0),
( 4, 'TP04', 'Etude Générale', 'Etude Générale', 2, 0),
( 5, 'TP05', 'Bureau de contrôle', 'Bureau de contrôle', 2, 0),
( 6, 'TP06', 'Etude Architecturale', 'Etude Architecturale', 2, 0),
( 7, 'TP07', 'Laboratoire', 'Laboratoire', 2, 0),
( 8, 'TP08', 'Géotechnique', 'Géotechnique', 2, 0),
( 9, 'TP09', 'Technique', 'Technique', 2, 0),
(10, 'TP10', 'Moquettes', 'Moquettes', 3, 0),
(11, 'TP11', 'Aspirateurs', 'Aspirateurs', 3, 0),
(12, 'TP12', 'Equipement sonneurs', 'Equipement sonneurs', 3, 0),
(13, 'TP13', 'Equipement techniques', 'Equipement techniques', 3, 0),
(14, 'TP14', 'Formation', 'Formation', 4, 0),
(15, 'TP15', 'Gestion et maintenance', 'Gestion et maintenance', 4, 0),
(16, 'TP16', 'Soutien de mission', 'Soutien de mission', 4, 0),
(17, 'TP17', 'Frais de maitrise d''ouvrage', 'Frais de maitrise d''ouvrage', 4, 0),
(18, 'TP18', 'Publicité', 'Publicité', 4, 0),
(19, 'TP19', 'Transport', 'Transport', 4, 0);








