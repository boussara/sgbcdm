INSERT INTO `brs_tra_res_code` (`trc_id`,`trc_code`,`trc_desc`,`trc_com`) VALUES 
 (109,'00','Transaction approuvée','Transaction approuvée'),
 (123,'01','Reportez-vous à l''émetteur','Reportez-vous à l''émetteur'),
 (124,'02','Voir Émetteur, spécial','Voir Émetteur, spécial'),
 (125,'03','Pas de marchand','Pas de marchand'),
 (126,'04','Prenez une carte','Prenez une carte'),
 (144,'05','Refusé par la banque','Refusé par la banque'),
 (127,'06','Problème avec le numéro de carte','Problème avec le numéro de carte'),
 (128,'07','Transaction traitée avec succès','identification NON requise'),
 (129,'08','Transaction approuvée','Transaction approuvée'),
 (130,'09','Transaction approuvée','Transaction approuvée'),
 (131,'10','Approuvé pour un montant partiel','Approuvé pour un montant partiel'),
 (132,'12','Transaction invalide','Transaction invalide'),
 (118,'13','Montant invalide','Montant invalide'),
 (110,'14','Numéro de carte invalide','Numéro de carte invalide'), 
 (114,'15','L''émetteur de carte du client n''existe pas','L''émetteur de carte du client n''existe pas'),
 (136,'19','Re-entrer la dernière transaction','Re-entrer la dernière transaction'),
 (137,'21','Pas d''action prise','Pas d''action prise'),
 (138,'22','Dysfonctionnement soupçonné','Dysfonctionnement soupçonné'),
 (139,'23','Frais de transaction inacceptables','Frais de transaction inacceptables'),
 (115,'25','Impossible de localiser l''enregistrement sur un fichier','L''émetteur de la carte client ne reconnaît pas les détails de la carte de crédit.'),
 (141,'30','Erreur de format','Erreur de format'),
 (142,'31','Banque non prise en charge par le commutateur','Banque non prise en charge par le commutateur'),
 (116,'33','Carte expirée, capture','Carte expirée, capture'), 
 (143,'34','Fraude présumée, conserver la carte','Fraude présumée, conserver la carte'),
 (144,'35','Accepteur de carte, contact acquéreur, conserver la carte','Accepteur de carte, contact acquéreur, conserver la carte'),
 (145,'36','Carte restreinte, carte à conserver','Carte restreinte, carte à conserver'),
 (146,'37','Contacter le service de sécurité de l''acquéreur, Conserver la carte','Contacter le service de sécurité de l''acquéreur, Conserver la carte'),
 (147,'38','Nombre de tentatives de dépassement du code PIN, capture','Nombre de tentatives de dépassement du code PIN, capture'),
 (148,'39','Pas de compte créditeur','Pas de compte créditeur'),
 (149,'40','Fonction non supportée','Fonction non supportée'),
 (150,'41','Carte perdue','Carte perdue'),
 (151,'42','Pas de compte universel','Pas de compte universel'),
 (152,'43','Carte volée','Carte volée'),
 (153,'44','Aucun compte d''investissement','Aucun compte d''investissement'),
 (108,'51','Fonds insuffisants','Fonds insuffisants'),
 (154,'52','Pas de compte chèque','Pas de compte chèque'),
 (155,'53','Pas de compte d''épargne','Pas de compte d''épargne'),
 (156,'54','Carte expirée','Carte expirée'),
 (112,'55','PIN incorrect','PIN incorrect'), 
 (157,'56','Aucun enregistrement de carte','Aucun enregistrement de carte'),
 (120,'57','Fonction non autorisée au titulaire de la carte','Fonction non autorisée au titulaire de la carte'),   
 (158,'58','Fonction non autorisée au terminal','Fonction non autorisée au terminal'),
 (159,'59','Fraude suspectée','fraude suspectée'),
 (121,'61','Dépasse la limite de retrait','Dépasse la limite de retrait'),
 (160,'62','Carte restreinte','Carte restreinte'),
 (161,'62','Violation de la sécurité','Violation de la sécurité'),
 (162,'62','Carte restreinte','Carte restreinte'),
 (163,'64','Montant initial incorrect','Montant initial incorrect'),
 (164,'65','Dépasse le retrait','Dépasse le retrait'),
 (165,'66','Acquéreur de contact accepteur, Sécurité','Acquéreur de contact accepteur, Sécurité'),
 (166,'67','Carte de capture','Carte de capture'),
 (117,'75','Nombre de tentatives de PIN dépassé','Nombre de tentatives de PIN dépassé'),
 (167,'82','Erreur de validation CVV','Erreur de validation CVV'),
 (168,'90','Arreté en cours','Arreté en cours'),
 (119,'91','Emetteur de carte indisponible','Emetteur de carte indisponible'),
 (169,'92','Impossible d''acheminer la transaction','Impossible d''acheminer la transaction'),
 (170,'93','Impossible de terminer, violation de la loi','Impossible de terminer, violation de la loi'),
 (171,'94','Dupliquer la transaction','Dupliquer la transaction'),
 (111,'96','Erreur système','Erreur système');
 
 
 
 
 
 select * from brs_tra_res_code where trc_id=1;
 
 