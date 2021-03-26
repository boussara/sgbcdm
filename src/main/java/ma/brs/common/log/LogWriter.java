package ma.brs.common.log;

import java.util.Date;

import org.sculptor.framework.context.ServiceContextStore;

import ma.brs.common.ApplicationContextHolder;
import ma.brs.sgbcdm.log.domain.LogLogType;
import ma.brs.sgbcdm.log.domain.LogNwsLog;
import ma.brs.sgbcdm.log.domain.LogNwsSession;
import ma.brs.sgbcdm.log.serviceapi.LogLogTypeService;
import ma.brs.sgbcdm.log.serviceapi.LogNwsLogService;
import ma.brs.sgbcdm.log.serviceapi.LogNwsSessionService;

public class LogWriter {
	
	private int nswSessionId;
	
	LogNwsSessionService logNwsSessionService;
	LogLogTypeService logLogTypeService;
	LogNwsLogService logNwsLogService;
	
	public LogWriter(int sessionId) {
		this.nswSessionId = sessionId;
		logNwsSessionService=ApplicationContextHolder.getContext().getBean(LogNwsSessionService.class);
		logLogTypeService=ApplicationContextHolder.getContext().getBean(LogLogTypeService.class);
		logNwsLogService=ApplicationContextHolder.getContext().getBean(LogNwsLogService.class);
	}
	
	public void writeLog(String logTypeCode, String moduleCode, String funcCode, String msg) {
		
		LogNwsLog log = new LogNwsLog();
		
		
		LogLogType logType = logLogTypeService.findLogLogTypeByLotCode(null,logTypeCode);
		LogNwsSession ses;

		ses = logNwsSessionService.findById(ServiceContextStore.get(),this.nswSessionId+0L,"");
	
		
		if ( logType == null ) {
			throw new IllegalArgumentException("The logTypeCode (" + logTypeCode + ") is incorrect, no item found in DB corresponding to to this value");
		}		
		
		log.setLogSesId(ses);
		log.setLogLotId(logType);
		log.setLogModCode(moduleCode);
		log.setLogFuncCode(funcCode);
		log.setLogMsgDetail(msg);
		log.setLogDate(new Date());
		
		logNwsLogService.save(null, log);		
		
	}
	
	public void writeLog(String logTypeCode, String moduleCode, String funcCode, String msg, String data, String ref, String updOld, String updNew) {
		
		LogNwsLog log = new LogNwsLog();
		
		LogLogType logType = logLogTypeService.findLogLogTypeByLotCode(null,logTypeCode);
		LogNwsSession ses;

		ses = logNwsSessionService.findById(ServiceContextStore.get(),this.nswSessionId+0L,"");
		
		if ( logType == null ) {
			throw new IllegalArgumentException("The logTypeCode (" + logTypeCode + ") is incorrect, no item found in DB corresponding to to this value");
		}
		
		log.setLogSesId(ses);
		log.setLogLotId(logType);
		log.setLogModCode(moduleCode);
		log.setLogFuncCode(funcCode);
		log.setLogMsgDetail(msg);
		log.setLogDate(new Date());
		
		log.setLogUpdData(data);
		if((ref!=null)&&(ref.length()>32)){
			ref=ref.substring(0, 32);
		}
		log.setLogUpdRef(ref);
		log.setLogUpdOld(updOld);
		log.setLogUpdNew(updNew);
		
		logNwsLogService.save(null, log);	
		
		
	}

	public int getNswSessionId() {
		return nswSessionId;
	}

	public void setNswSessionId(int nswSessionId) {
		this.nswSessionId = nswSessionId;
	}

}
