		INSERT INTO adm_app_func_grp (afg_id,afg_apm_id,afg_name,afg_code,afg_menu_id, version) VALUES
								(60600,6,'Traitement des Demandes SGM','MenuTraitDemMouvSGM',60600, 1);					
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60611,	6,60600,	'BudTraitDemVirSGMResource',1,1,'BudTraitDemVirSGMResource','/rest/budresources/budTraitDemVirSGM/search',60611, 1);		
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60612,	6,60600,	'BudTraitDemDelegSGMResource',1,1,'BudTraitDemDelegSGMResource','/rest/budresources/budTraitDemDelegSGM/search',60612, 1);		
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60613,	6,60600,	'BudTraitDemReducSGMResource',1,1,'BudTraitDemReducSGMResource','/rest/budresources/budTraitDemReducSGM/search',60613, 1);		
	
	
	
		INSERT INTO adm_app_func_grp (afg_id,afg_apm_id,afg_name,afg_code,afg_menu_id, version) VALUES
								(60700,6,'Traitement des Demandes SP','MenuTraitDemMouvSP',60700, 1);					
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60701,	6,60700,	'BudTraitDemVirSPResource',1,1,'BudTraitDemVirSPResource','/rest/budresources/budTraitDemVirSP/search',60701, 1);		
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60702,	6,60700,	'BudTraitDemDelegSPResource',1,1,'BudTraitDemDelegSPResource','/rest/budresources/budTraitDemDelegSP/search',60702, 1);		
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60703,	6,60700,	'BudTraitDemReducSPResource',1,1,'BudTraitDemReducSPResource','/rest/budresources/budTraitDemReducSP/search',60703, 1);		
	
	
	
		INSERT INTO adm_app_func_grp (afg_id,afg_apm_id,afg_name,afg_code,afg_menu_id, version) VALUES
								(60800,6,'Traitement des Demandes TM','MenuTraitDemMouvTM',60800, 1);					
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60801,	6,60800,	'BudTraitDemVirTMResource',1,1,'BudTraitDemVirTMResource','/rest/budresources/budTraitDemVirTM/search',60801, 1);		
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60802,	6,60800,	'BudTraitDemDelegTMResource',1,1,'BudTraitDemDelegTMResource','/rest/budresources/budTraitDemDelegTM/search',60802, 1);		
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (60803,	6,60800,	'BudTraitDemReducTMResource',1,1,'BudTraitDemReducTMResource','/rest/budresources/budTraitDemReducTM/search',60803, 1);		
	
	

	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (59114,	5,	NULL,	'PlaCreditOpDemandeSGMResource',1,1,'PlaCreditOpDemandeSGMResource','/rest/plaresources/plaCreditOpDemandeSGM/search',59114, 1);
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (59115,	5,	NULL,	'PlaCreditOpDemandeCIResource',1,1,'PlaCreditOpDemandeCIResource','/rest/plaresources/plaCreditOpDemandeCI/search',59115, 1);
	
	
	
	INSERT INTO adm_app_function (apf_id,apf_apm_id,apf_afg_id,apf_name,apf_active,apf_pci,apf_code,apf_url,apf_menu_id, version) VALUES
	 (59116,	5,	NULL,	'PlaCreditOpDemandeSPResource',1,1,'PlaCreditOpDemandeSPResource','/rest/plaresources/plaCreditOpDemandeSP/search',59116, 1);