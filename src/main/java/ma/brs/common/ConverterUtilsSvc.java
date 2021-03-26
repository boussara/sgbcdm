package ma.brs.common;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class ConverterUtilsSvc {
	
	private static final Logger logger = Logger.getLogger(ConverterUtilsSvc.class);
	
	public String encodeForPci(String pan) {
		
		if ((pan==null)||(pan.length()<1)){
			logger.debug("encodeForPci -- Pan is null !!! ");
			return "";
		}

        // Bin Lent
        int binL=6;
        
        // Last chars lent
        int lastCharL=4;

        // Pan Lent
        int len = pan.length();
        if(len<(binL+lastCharL)){ 
        	//			logger.error("encodeForPci -- len < binL+lastCharL !!! len = "+len+" binL = "+binL+" lastCharL = "+lastCharL);
            return pan;
        }

        // Fillet Lent
        int filL=len-lastCharL;

        // fisrchars
        String firstValue = pan.substring(0, binL);
        String lastValue = pan.substring(len-lastCharL, len);

        String retValue=StringUtils.rightPad(firstValue, filL, "*")+lastValue;

        return retValue;
    }
}
