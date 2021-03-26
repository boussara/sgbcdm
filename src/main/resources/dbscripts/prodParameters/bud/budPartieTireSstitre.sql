INSERT INTO bud_partie (prt_id,prt_code,prt_name,prt_desc, "version") 
VALUES 
( 1,'1','Reccete',NULL, 0),
( 2,'2','Dépense',NULL, 0);

INSERT INTO bud_titre (ttr_id,ttr_code,ttr_name,ttr_desc, "version") 
VALUES 
( 1,'1','Fonctionnement',NULL, 0),
( 2,'2','Investissement',NULL, 0);

INSERT INTO bud_ss_titre (str_id,str_code,str_name,str_desc,str_ttr_id, "version") 
VALUES
( 1,'1','Dépenses personnel',NULL,1, 0),
( 2,'2','Dépenses matériel et diverses',NULL,1, 0),
( 3,'3','Charges communes',NULL,1, 0),
( 4,'4','Dépenses imprévues',NULL,1, 0);
