package ma.brs.easyatm.ejr.serviceimpl.ejrproc;

import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.domain.PagedResult;
import org.sculptor.framework.domain.PagingParameter;

import ma.brs.easyatm.common.ApplicationContextHolder;
import ma.brs.easyatm.ejr.serviceapi.EjrAlimentationService;
import ma.brs.easyatm.ejr.serviceapi.EjrCasNotifService;
import ma.brs.easyatm.ejr.serviceapi.EjrCashCounterService;
import ma.brs.easyatm.ejr.serviceapi.EjrCassetteService;
import ma.brs.easyatm.ejr.serviceapi.EjrTransTypeService;
import ma.brs.easyatm.mon.domain.MonNeDevice;
import ma.brs.easyatm.mon.domain.MonNeSubdevice;
import ma.brs.easyatm.mon.domain.MonNeSubdeviceProperties;
import ma.brs.easyatm.mon.domain.MonXfsProperty;
import ma.brs.easyatm.mon.domain.MonXfsValue;
import ma.brs.easyatm.mon.serviceapi.MonDevStateService;
import ma.brs.easyatm.mon.serviceapi.MonNeDeviceService;
import ma.brs.easyatm.mon.serviceapi.MonNeSubdeviceDTO;
import ma.brs.easyatm.mon.serviceapi.MonNeSubdeviceService;
import ma.brs.easyatm.mon.serviceapi.MonServiceClassService;
import ma.brs.easyatm.mon.serviceapi.MonXfsPropertyService;
import ma.brs.easyatm.mon.serviceapi.MonXfsValueService;
import ma.brs.easyatm.top.domain.TopNe;

public class EjrFileDeviceProcessor {
	
	private TopNe topNe=null;
	
	
	EjrTransTypeService ejrTransTypeService;
	EjrCashCounterService ejrCashCounterService;
	EjrCasNotifService ejrCasNotifService;
	EjrCassetteService ejrCassetteService;
	EjrAlimentationService ejrAlimentationService;
	MonNeDeviceService monNeDeviceService;
	MonNeSubdeviceService monNeSubdeviceService;
	MonXfsPropertyService monXfsPropertyService;
	MonXfsValueService monXfsValueService;
	MonServiceClassService monServiceClassService;
	MonDevStateService monDevStateService;
	
		
	protected int lastLine=-1;
	protected String lineBefore="";
	protected Date lastEventDate=null;
	protected Date lastRetraitDate=null;
	protected BufferedReader fileReader = null;
	protected List<String> lines= null;
	protected String lastDateFormat ="";
	protected String lineToProcess="";
	private static final SimpleDateFormat fileDateFormat = new SimpleDateFormat("yyyy/MM/dd");	
	
	public static final int PROCESS_OK=0;
	public static final int PROCESS_NOK_SYSTEM_ERROR=-2;
	public static final int PROCESS_NOK_FILE_EMPTY=-3;
	public static final int PROCESS_OK_END_OF_FILE=-4;
	public static final int PROCESS_NOK_INCORRECT_DATE_FORMAT=-5;
	
	private static final Logger logger = Logger.getLogger(EjrFileDeviceProcessor.class);
	
	MonNeSubdevice subdev=new MonNeSubdevice();
	
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	public EjrFileDeviceProcessor() {		
		monNeDeviceService=ApplicationContextHolder.getContext().getBean(MonNeDeviceService.class);
		monNeSubdeviceService=ApplicationContextHolder.getContext().getBean(MonNeSubdeviceService.class);
		monXfsPropertyService=ApplicationContextHolder.getContext().getBean(MonXfsPropertyService.class);
		monXfsValueService=ApplicationContextHolder.getContext().getBean(MonXfsValueService.class);		
		monServiceClassService=ApplicationContextHolder.getContext().getBean(MonServiceClassService.class);
		monDevStateService=ApplicationContextHolder.getContext().getBean(MonDevStateService.class);
	}
	
	public void setTopNe(TopNe gab) {
		topNe=gab;
	}
	
	public int processFile(ServiceContext ctx, String filepath, Date elogDate){
		if(this.topNe==null){
			logger.error("processFile --> Ne is null !!!");
			return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;			
		}
		if(filepath==null){
			logger.error("processFile --> Input Stream is null !!!");
			return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;			
		}
//		if(elogDate==null){
//			logger.error("processFile --> Elog Date is null !!!");
//			return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;			
//		}
		
		logger.error("processFile :"+filepath+ " elogDate=" + elogDate);
		// Init variables
		this.lastLine=-1;
		this.lineBefore="";
		this.lastEventDate=elogDate;
		this.fileReader = null;
		this.lastDateFormat="";
		this.lines = null;
		String strDate;
		
		try {
			strDate = fileDateFormat.format(elogDate);
		} catch (Exception e){
			logger.error("processFile --> Exception while openneing the file :",e);
			return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;
		}
		// Open the file
		Charset charset = Charset.forName("ISO-8859-1");
		try {
			this.lines = Files.readAllLines(Paths.get (filepath), charset);

		} catch (IOException e) {
			logger.error("processFile --> IOException while openneing the file :", e);
			return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;
		}catch (Exception e) {
			logger.error("processFile --> Exception while openneing the file :", e);
			return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;
		}
		logger.error("processFile size :"+this.lines.size());
		
		// Check if empty		
		boolean error=false;
		boolean fileempty=false;		
        if ((this.lines==null)||(this.lines.size()==0)) {   	
            	logger.error("processFile --> Empty elog file !!!");
            	fileempty=true;                  	
        } 
        
        if((fileempty)||(error))
        {       	
        	if(fileempty){
            	return EjrFileProcessor.PROCESS_NOK_FILE_EMPTY;
            }
            if(error){
            	return EjrFileProcessor.PROCESS_NOK_SYSTEM_ERROR;
            }
        }
        
     // Boucle sur les lignes
        String line="";
        int indice =0;
        int i =0;
        int res=PROCESS_OK;
        while((res==EjrFileProcessor.PROCESS_OK) && (!this.lines.isEmpty()))
        {
            try 
            {
                if (line!=null)
                    lineBefore=line;                
                line = this.lines.remove(0);
                i++;
                indice ++;
            } catch (Exception ex) {
                logger.error("Error reading log file :"+elogDate+" at line :"+indice+" with reason :"+ex.getMessage());
                line = null;
                res=EjrFileProcessor.PROCESS_OK_END_OF_FILE;
            }

            if (line==null)
            {
                if (indice < this.lastLine)
                {
                    this.lastLine=0;
                }
                res=EjrFileProcessor.PROCESS_OK_END_OF_FILE;
            }
            
            if ((indice>this.lastLine) && (line!=null))
            {
                res = processLine(ctx, line, elogDate, strDate);
                if (res == EjrFileProcessor.PROCESS_OK)
                {
                    this.lastLine+=1;
                    indice = this.lastLine;
                }
            }
        }
		
      /*  // Close the file
        if(fileReader!=null)
    	{
    		try{
    			fileReader.close();
    		} catch (Exception e) {
    			logger.error("processFile --> Exception while closing reader :",e);
			}        		
    	}*/
        
        if(res==EjrFileProcessor.PROCESS_OK_END_OF_FILE){
        	res=EjrFileProcessor.PROCESS_OK;
        }
		
		return res;
	}
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	private int processLine(ServiceContext ctx, String line, Date elogDate, String strFileDate){
		
		if(line.contains("XFSGenericService::Creation du service"))
			processLineSvc(ctx,line);
		else
			processLineDev(ctx,line);
		
		
		return EjrFileProcessor.PROCESS_OK;
	}
	
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	private int processLineSvc(ServiceContext ctx, String line){
		
		logger.error("processFileSvc --> line :"+line);
		
		String str=line.substring(line.indexOf("| XFSGenericService::Creation du service :"));
		str=str.replace("| XFSGenericService::Creation du service :","");
		
		String[] table=str.split(":");
		
		logger.info("processFileSvc --> table[0]="+table[0]+" table[1]="+table[1]+" table[2]="+table[2]+" table[3]="+table[3]);
		
		MonNeDevice dev=new MonNeDevice();
		dev.setNdeName(table[0].trim());
		dev.setNdeSrvId(monServiceClassService.findSvcClass(ctx, table[1].trim()));		
		dev.setNdeType(table[3].trim());
		dev.setNdeDstId(monDevStateService.findById(ctx,0L,""));
		dev.setNdeNeId(topNe);
		
		monNeDeviceService.save(ctx, dev);
		
		return EjrFileProcessor.PROCESS_OK;
	}
	
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------------*/
	private int processLineDev(ServiceContext ctx, String line){
		
		logger.error("processFileDev --> line :"+line);
		
		processCDMInfo(ctx,line);
		processIDCInfo(ctx,line);
		processPINInfo(ctx,line); 
		processPTRInfo(ctx,line);
		processTTUInfo(ctx,line);
		processSIUInfo(ctx,line);
		
		return EjrFileProcessor.PROCESS_OK;
	}
	
	private void processCDMInfo(ServiceContext ctx, String line) {
		if(!line.contains("XFSCDMService"))
			return;
		
		if(line.contains("| XFSCDMService::retrieveCashUnitList -> 1 ")) {
			//delete all CashUnitList
			String str=line.substring(line.indexOf("| XFSCDMService::retrieveCashUnitList -> 1 "));
			str=str.replaceFirst("| XFSCDMService::retrieveCashUnitList -> 1 ","");
			str=str.replace("|","");
			String[] table=str.split("\\[\\]");
			
			
			MonNeSubdeviceDTO dto=new MonNeSubdeviceDTO();
			dto.addCriteriaInfo("is not null", MonNeSubdeviceProperties.nsdNsdId(), null);
			dto.addCriteriaInfo("=", MonNeSubdeviceProperties.nsdNdeId().ndeName(), table[1].trim());
			dto.addCriteriaInfo("=", MonNeSubdeviceProperties.nsdName(), "Sub-devices Number");
			
			PagedResult<MonNeSubdevice> res=monNeSubdeviceService.search(ctx, dto, PagingParameter.noLimits());
			
			for(MonNeSubdevice aa:res.getValues()) {
				monNeSubdeviceService.delete(ctx, aa);
			}
			
			dto=new MonNeSubdeviceDTO();
			dto.addCriteriaInfo("is null", MonNeSubdeviceProperties.nsdNsdId(), null);
			dto.addCriteriaInfo("=", MonNeSubdeviceProperties.nsdNdeId().ndeName(), table[1].trim());
			dto.addCriteriaInfo("=", MonNeSubdeviceProperties.nsdName(), "Sub-devices Number");
			
			res=monNeSubdeviceService.search(ctx, dto, PagingParameter.noLimits());
			
			for(MonNeSubdevice aa:res.getValues()) {
				monNeSubdeviceService.delete(ctx, aa);
			}
		}
		
		
		if(line.contains("XFSCDMService::setSafeDoorStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setSafeDoorStatus -->","xfsCDMStatusSafeDoor","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setDispenserStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setDispenserStatus -->","xfsCDMStatusDispenser","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setIntermediateStackerStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setIntermediateStackerStatus -->","xfsCDMStatusIntermediateStacker","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setDevicePosition")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setDevicePosition -->","xfsCDMStatusDevicePosition","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setPowerSaveRecoveryTime")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setPowerSaveRecoveryTime -->","xfsCDMStatusPowerSaveRecoveryTime","CDM30",false);				
		}
		else if(line.contains("XFSCDMService::setDispenserStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setDispenserStatus -->","xfsCDMStatusDispenser","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setDispenserStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setDispenserStatus -->","xfsCDMStatusDispenser","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setDispenserStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setDispenserStatus -->","xfsCDMStatusDispenser","CDM30",true);				
		}
		else if(line.contains("XFSCDMService::setDispenserStatus")) {			
			updateSubDevice(ctx,line,"XFSCDMService::setDispenserStatus -->","xfsCDMStatusDispenser","CDM30",true);				
		}
		
		
		if(line.contains("XFSCDMService::retrieveCashUnitList -> 4 CashUnitName")) {
			subdev=new MonNeSubdevice();
			MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMStatusNumberSubDevices");
			String str=line.substring(line.indexOf("XFSCDMService::retrieveCashUnitList -> 4 CashUnitName="));
			
			str=str.replace("XFSCDMService::retrieveCashUnitList -> 4 CashUnitName=","");
			str=str.replace("|","");
			String[] table=str.split("\\[\\]");
			
			subdev.setNsdName(prop.getProDescription());
			subdev.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
			subdev=monNeSubdeviceService.save(ctx,subdev);
		}
		
		
		MonNeSubdevice sub=new MonNeSubdevice();
		if(line.contains("XFSCDMService::retrieveCashUnitList -> 6")) {
			String ligne=line.substring(line.indexOf("XFSCDMService::retrieveCashUnitList -> 6 "));
			String str2=ligne.replaceFirst("XFSCDMService::retrieveCashUnitList -> 6 ","");			
			if(str2.contains("logCashUnit->usType=")) {
				str2=str2.replaceFirst("logCashUnit->usType=","");
				str2=str2.replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
								
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUType");				
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2).add(new BigDecimal(1)));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulValues=")) {
				str2=str2.replaceFirst("logCashUnit->ulValues=","").replace("|","");
				str2=str2.replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUValues");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulInitialCount=")) {
				str2=str2.replaceFirst("logCashUnit->ulInitialCount=","").replace("|","");				
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCULInitialCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulCount=")) {
				str2=str2.replaceFirst("logCashUnit->ulCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCULCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulRejectCount=")) {
				str2=str2.replaceFirst("logCashUnit->ulRejectCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCULRejectCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulMinimum=")) {
				str2=str2.replaceFirst("logCashUnit->ulMinimum=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUMinimum");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulMaximum=")) {
				str2=str2.replaceFirst("logCashUnit->ulMaximum=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCULMaximum");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->bAppLock=")) {
				str2=str2.replaceFirst("logCashUnit->bAppLock=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUAppLock");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->usStatus=")) {
				str2=str2.replaceFirst("logCashUnit->usStatus=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCULogicalStatus");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2).add(new BigDecimal(1)));
				
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				logger.info("logCashUnit->usStatus="+sub.getId()+" value="+value);
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("logCashUnit->ulRetractedCount=")) {
				str2=str2.replaceFirst("logCashUnit->ulRetractedCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCULRetractedCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
		}
		else if(line.contains("XFSCDMService::retrieveCashUnitList -> 12")) {
			String ligne=line.substring(line.indexOf("XFSCDMService::retrieveCashUnitList -> 12 "));
			String str2=ligne.replaceFirst("XFSCDMService::retrieveCashUnitList -> 12 ","");			
			if(str2.contains("phyCashUnit->lpPhysicalPositionName=")) {
				str2=str2.replaceFirst("phyCashUnit->lpPhysicalPositionName=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPhysicalPositionName");
				//MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdStrValue(str2);
				sub.setNsdNsdId(subdev);
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulInitialCount=")) {
				str2=str2.replaceFirst("phyCashUnit->ulInitialCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPInitialCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulCount=")) {
				str2=str2.replaceFirst("phyCashUnit->ulCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulRejectCount=")) {
				str2=str2.replaceFirst("phyCashUnit->ulRejectCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPRejectCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulMaximum=")) {
				str2=str2.replaceFirst("phyCashUnit->ulMaximum=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPMaximumCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->usPStatus=")) {
				str2=str2.replaceFirst("phyCashUnit->usPStatus=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPhysicalStatus");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2).add(new BigDecimal(1)));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->bHardwareSensor=")) {
				str2=str2.replaceFirst("phyCashUnit->bHardwareSensor=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUHardwareSensor");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulDispensedCount=")) {
				str2=str2.replaceFirst("phyCashUnit->ulDispensedCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPDispensedCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulPresentedCount=")) {
				str2=str2.replaceFirst("phyCashUnit->ulPresentedCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPPresentedCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}
			else if(str2.contains("phyCashUnit->ulRetractedCount=")) {
				str2=str2.replaceFirst("phyCashUnit->ulRetractedCount=","").replace("|","");
				String[] table=str2.split("\\[\\]");
				str2=table[0];
				MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, "xfsCDMSubDeviceCUPRetractedCount");
				MonXfsValue  value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(str2));
				
				MonNeSubdevice tmp=monNeSubdeviceService.findByNsdAndName(ctx,subdev, prop.getProDescription());
				if(tmp!=null) sub=tmp;
				
				sub.setNsdName(prop.getProDescription());
				sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1].trim()).get(0));
				sub.setNsdValId(value);
				//sub.setNsdProId(prop);
				sub.setNsdNsdId(subdev);
				sub.setNsdValue(new BigDecimal(str2));
				
				monNeSubdeviceService.save(ctx,sub);
			}			
		}
				
	}
	

	private void processIDCInfo(ServiceContext ctx, String line) {
		if(!line.contains("XFSIDCService"))
			return;
				
		if(line.contains("XFSIDCService::setMediaStatus")) {			
			updateSubDevice(ctx,line,"XFSIDCService::setMediaStatus -->","xfsIDCStatusMedia","IDC30",true);				
		}
		else if(line.contains("XFSIDCService::setRetainBinStatus")) {			
			updateSubDevice(ctx,line,"XFSIDCService::setRetainBinStatus -->","xfsIDCStatusRetainBin","IDC30",true);				
		}
		else if(line.contains("XFSIDCService::setSecurityStatus")) {			
			updateSubDevice(ctx,line,"XFSIDCService::setSecurityStatus -->","xfsIDCStatusSecurity","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setChipPowerStatus")) {
			updateSubDevice(ctx,line,"XFSIDCService::setChipPowerStatus -->","xfsIDCStatusChipPower","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setCards")) {
			updateSubDevice(ctx,line,"XFSIDCService::setCards -->","xfsIDCStatusCardRetained","IDC30",false);			
		}
		else if(line.contains("XFSIDCService::setDevicePosition")) {
			updateSubDevice(ctx,line,"XFSIDCService::setDevicePosition -->","xfsIDCStatusChipPower","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setPowerSaveRecoveryTime")) {
			updateSubDevice(ctx,line,"XFSIDCService::setPowerSaveRecoveryTime -->","xfsIDCStatusPowerSaveRecoveryTime","IDC30",false);			
		}
		else if(line.contains("XFSIDCService::setChipModuleStatus")) {
			updateSubDevice(ctx,line,"XFSIDCService::setChipModuleStatus -->","xfsIDCStatusChipModule","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setMagReadModuleStatus")) {
			updateSubDevice(ctx,line,"XFSIDCService::setMagReadModuleStatus -->","xfsIDCStatusMagReadModule","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setMagWriteModuleStatus")) {
			updateSubDevice(ctx,line,"XFSIDCService::setMagWriteModuleStatus -->","xfsIDCStatusMagWriteModule","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setFrontImageModuleStatus")) {
			updateSubDevice(ctx,line,"XFSIDCService::setFrontImageModuleStatus -->","xfsIDCStatusFrontImageModule","IDC30",true);			
		}
		else if(line.contains("XFSIDCService::setBackImageModuleStatus")) {
			updateSubDevice(ctx,line,"XFSIDCService::setBackImageModuleStatus -->","xfsIDCStatusBackImageModule","IDC30",true);			
		}
	}
	

	private void processPINInfo(ServiceContext ctx, String line) {
		if(!line.contains("XFSPINService"))
			return;
		
		if(line.contains("XFSPINService::setEncStatus")) {			
			updateSubDevice(ctx,line,"XFSPINService::setEncStatus -->","xfsPINStatusEncStat","PIN30",true);				
		}
		else if(line.contains("XFSPINService::setDevicePosition")) {			
			updateSubDevice(ctx,line,"XFSPINService::setDevicePosition -->","xfsPINStatusDevicePosition","PIN30",true);				
		}
		else if(line.contains("XFSPINService::setPowerSaveRecoveryTime")) {			
			updateSubDevice(ctx,line,"XFSPINService::setPowerSaveRecoveryTime -->","xfsPINStatusPowerSaveRecoveryTime","PIN30",false);				
		}
		else if(line.contains("XFSPINService::setAutoBeepModeStatus")) {			
			updateSubDevice(ctx,line,"XFSPINService::setAutoBeepModeStatus -->","xfsPINStatusAutoBeepMode","PIN30",true);				
		}
		else if(line.contains("XFSPINService::setCertificateState")) {			
			updateSubDevice(ctx,line,"XFSPINService::setCertificateState -->","xfsPINStatusCertificateState","PIN30",true);				
		}
	}
	
	private void processPTRInfo(ServiceContext ctx, String line) {
		if(!line.contains("XFSPTRService"))
			return;
		
		if(line.contains("XFSPTRService::setMediaStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setMediaStatus -->","xfsPTRStatusMedia","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setTonerStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setTonerStatus -->","xfsPTRStatusToner","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setInkStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setInkStatus -->","xfsPTRStatusInk","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setLampStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setLampStatus -->","xfsPTRStatusLamp","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setMediaOnStacker")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setMediaOnStacker -->","xfsPTRStatusMediaOnStacker","PRJ30",false);				
		}
		else if(line.contains("XFSPTRService::setSupplyUpperPaperStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setSupplyUpperPaperStatus -->","xfsPTRStatusPaperSupplyUpper","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setSupplyLowerPaperStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setSupplyLowerPaperStatus -->","xfsPTRStatusPaperSupplyLower","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setSupplyExternalPaperStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setSupplyExternalPaperStatus -->","xfsPTRStatusPaperSupplyExternal","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setSupplyAuxPaperStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setSupplyAuxPaperStatus -->","xfsPTRStatusPaperSupplyAux","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setSupplyAux2PaperStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setSupplyAux2PaperStatus -->","xfsPTRStatusPaperSupplyAux2","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setSupplyParkPaperStatus")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setSupplyParkPaperStatus -->","xfsPTRStatusPaperSupplyPark","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setDevicePosition")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setDevicePosition -->","xfsPTRStatusDevice","PRJ30",true);				
		}
		else if(line.contains("XFSPTRService::setPowerSaveRecoveryTime")) {			
			updateSubDevice(ctx,line,"XFSPTRService::setPowerSaveRecoveryTime -->","xfsPTRStatusPowerSaveRecoveryTime","PRJ30",false);				
		}
	}
	
	private void processTTUInfo(ServiceContext ctx, String line) {
		if(!line.contains("XFSTTUService"))
			return;
		
		if(line.contains("XFSTTUService::setKeyboardStatus")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setKeyboardStatus -->","xfsTTUStatusKeyboard","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setKeyLockStatus")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setKeyLockStatus -->","xfsTTUStatusKeyLock","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setPowerSaveRecoveryTime")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setPowerSaveRecoveryTime -->","xfsTTUStatusPowerSaveRecoveryTime","TTU30",false);				
		}
		else if(line.contains("XFSTTUService::setDisplaySizeX")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setDisplaySizeX -->","xfsTTUStatusDisplaySizeX","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setDisplaySizeY")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setDisplaySizeY -->","xfsTTUStatusDisplaySizeY","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setDevicePosition")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setDevicePosition -->","xfsTTUStatusDevicePosition","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=1")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=1","xfsTTUStatusLed1","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=2")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=2","xfsTTUStatusLed2","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=3")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=3","xfsTTUStatusLed3","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=4")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=4","xfsTTUStatusLed4","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=5")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=5","xfsTTUStatusLed5","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=6")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=6","xfsTTUStatusLed6","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=7")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=7","xfsTTUStatusLed7","TTU30",true);				
		}
		else if(line.contains("XFSTTUService::setLedStatus --> indice=8")) {			
			updateSubDevice(ctx,line,"XFSTTUService::setLedStatus --> indice=8","xfsTTUStatusLed8","TTU30",true);				
		}
	}
	
	private void processSIUInfo(ServiceContext ctx, String line) {
		if(!line.contains("XFSSIUService"))
			return;
		
		if(line.contains("XFSSIUService::setSensorStatus --> indice=0")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=0","xfsSIUStatusOperatorSwitchSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=1 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=1","xfsSIUStatusTamperSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=2 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=2","xfsSIUStatusIntTamperSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=3 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=3","xfsSIUStatusSeismicSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=4")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=4","xfsSIUStatusHeatSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=5")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=5","xfsSIUStatusProximitySensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=6")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=6","xfsSIUStatusAmbLightSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setSensorStatus --> indice=7")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setSensorStatus --> indice=7","xfsSIUStatusEnhancedAudioSensors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setDoorStatus --> indice=0")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setDoorStatus --> indice=0","xfsSIUStatusCabinetDoors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setDoorStatus --> indice=1 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setDoorStatus --> indice=1","xfsSIUStatusSafeDoors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setDoorStatus --> indice=2 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setDoorStatus --> indice=2","xfsSIUStatusVandalShieldDoors","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setIndicatorStatus --> indice=0")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setIndicatorStatus --> indice=0","xfsSIUStatusOpenCloseIndicators","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setIndicatorStatus --> indice=1 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setIndicatorStatus --> indice=1","xfsSIUStatusFasciaLightIndicators","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setIndicatorStatus --> indice=2 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setIndicatorStatus --> indice=2","xfsSIUStatusAudioIndicators","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setIndicatorStatus --> indice=3 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setIndicatorStatus --> indice=3","xfsSIUStatusHeatingIndicators","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setAuxiliarieStatus --> indice=0")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setAuxiliarieStatus --> indice=0","xfsSIUStatusVolumeAux","SIU30",false);				
		}
		else if(line.contains("XFSSIUService::setAuxiliarieStatus --> indice=1 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setAuxiliarieStatus --> indice=1","xfsSIUStatusUPSAux","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setAuxiliarieStatus --> indice=2 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setAuxiliarieStatus --> indice=2","xfsSIUStatusRemoteStatusMonitorAux","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setAuxiliarieStatus --> indice=3 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setAuxiliarieStatus --> indice=3","xfsSIUStatusAudibleAlarmAux","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setAuxiliarieStatus --> indice=4")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setAuxiliarieStatus --> indice=4","xfsSIUStatusEnhancedAudioControlAux","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=0")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=0","xfsSIUStatusCardUnitGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=1 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=1","xfsSIUStatusPinpadGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=2 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=2","xfsSIUStatusNotesDispenserGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=3 ")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=3","xfsSIUStatusCoinDispenserGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=4")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=4","xfsSIUStatusReceiptPrinterGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=5")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=5","xfsSIUStatusPassbookPrinterGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=6")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=6","xfsSIUStatusEnvDepositoryGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=7")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=7","xfsSIUStatusChequeUnitGuidelights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=8")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=8","xfsSIUStatusBillAcceptorGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=9")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=9","xfsSIUStatusEnvDispenserGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=10")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=10","xfsSIUStatusDocumentPrinterGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=11")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=11","xfsSIUStatusCoinAcceptorGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setGuidLightStatus --> indice=12")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setGuidLightStatus --> indice=12","xfsSIUStatusScannerGuideLights","SIU30",true);				
		}
		else if(line.contains("XFSSIUService::setPowerSaveRecoveryTime")) {			
			updateSubDevice(ctx,line,"XFSSIUService::setPowerSaveRecoveryTime -->","xfsSIUStatusPowerSaveRecoveryTime","SIU30",false);				
		}		
	}
	
	
	private void updateSubDevice(ServiceContext ctx, String line,String field,String xfsprop,String svc,boolean val) {
		MonNeSubdevice sub=new MonNeSubdevice();
		String str=line.substring(line.indexOf(field+" value ="));
		str=str.replaceFirst(field+" value =","");
		str=str.replace("|","");
		String[] table=str.split("\\[\\]");
		MonXfsProperty prop=monXfsPropertyService.findXfsProperty(ctx, xfsprop);
		MonXfsValue  value=null;
		if(val)
			value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(table[0]).add(new BigDecimal(1)));
		else
			value=monXfsValueService.findXfsValue(ctx, prop,new BigDecimal(table[0]));
		
		MonNeSubdevice tmp=monNeSubdeviceService.findByName(ctx, prop.getProDescription());
		if(tmp!=null) sub=tmp;
		
		sub.setNsdName(prop.getProDescription());
		sub.setNsdNdeId(monNeDeviceService.findByNdeNeIdAndNdeName(ctx,topNe, table[1]).get(0));
		sub.setNsdValId(value);
		//sub.setNsdProId(prop);
		sub.setNsdValue(new BigDecimal(table[0]));
		
		monNeSubdeviceService.save(ctx,sub);
	}

}
