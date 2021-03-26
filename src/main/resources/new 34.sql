ALTER TABLE `brs_gab`
	DROP FOREIGN KEY `id_name_fk`;
	
	
alter table brs_solde DROP FOREIGN KEY brs_solde_uk;	


ALTER TABLE `brs_device`   
  ADD `dev_supply` int(11) NOT NULL,  
  ADD `dev_date` datetime NOT NULL;