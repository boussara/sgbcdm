SELECT etr_Ent_Id AS totEntId,
		

etr_Tra_Cur_Id AS totCurId,

SUBSTR(etr_Proc_Code,1,2) AS totTrcCode,

TO_DATE(TO_CHAR(etr_Tra_Date,'dd/MM/yyyy'),'dd/MM/yyyy') AS totDate,
	
count(*) AS totCount,

sum(etr_tra_Amt) AS totAmount
		
FROM MER_EDC_TRANSACTION
WHERE etr_Rec_Indic='I'
GROUP BY etr_Ent_Id,etr_Tra_Cur_Id,SUBSTR(etr_Proc_Code,1,2),TO_DATE(TO_CHAR(etr_Tra_Date,'dd/MM/yyyy'),'dd/MM/yyyy');