package ma.brs.common;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;


@Service("commonThreadHandlerapi")
public class CommonThreadHandlerImpl implements CommonThreadHandlerapi {

	private static final Logger logger = Logger.getLogger(CommonThreadHandlerImpl.class);
	
	private Map<String, Thread> listThreads=new LinkedHashMap<String, Thread>();
	private Map<String, String> listThreadsStopped=new LinkedHashMap<String, String>();
	
	@Override
	public void list() {
	 
		if(!listThreads.isEmpty())
			for(String key:listThreads.keySet()){
				logger.info(key +" : "+listThreads.get(key));
				System.out.println(key +" : "+listThreads.get(key));
			}

	}

	@Override
	public void addThread(String name, Thread t) {
		listThreads.put(name, t);

	}

	@SuppressWarnings("deprecation")
	@Override
	public void stopThread(String name) {
		if(!listThreads.isEmpty()){
			Thread T=listThreads.get(name);
			if(T!=null){				
				//T.stop();
				listThreads.remove(name);
				listThreadsStopped.put(name, "Stopped");
			}
		}		
	}

	@Override
	public boolean check(String name) {
		return listThreadsStopped.get(name)!=null;
	}

}
