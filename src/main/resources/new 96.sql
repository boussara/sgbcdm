select *
from adm_user_account 
where usa_login='Hanane'

select roles.usa_login as username,roles.apf_code as role      
from (
	SELECT distinct(apf_code),usa_login        
	FROM adm_app_function,adm_usr_apf,adm_user_role,adm_user_account,adm_user_acc_role        
	WHERE usp_apf_id = apf_id        
	AND ((usp_create = 1) OR (usp_read = 1) OR (usp_update = 1) OR (usp_delete = 1) OR (usp_validate = 1))        
	AND usr_id=usp_usr_id        
	AND uar_usr_id=usr_id        
	and uar_usa_id=usa_id        
	and usa_login='Hanane'      ) roles