package ma.brs.common;

public class BinTermCsts {
	
	
	public static final String TERM_NETWORK_ONUS="U";
	public static final String TERM_NETWORK_OFFUS="F";
	public static final String TERM_NETWORK_INTERNATIONAL="I";
	
	public static String getTermNetworkName(String network){
		String res = "";
		if (network==null){
			return res;
		}
		
		if (network.compareTo(BinTermCsts.TERM_NETWORK_ONUS)==0) {
			return "ON-US";
		}
		if (network.compareTo(BinTermCsts.TERM_NETWORK_OFFUS)==0) {
			return "OFF-US";
		}
		if (network.compareTo(BinTermCsts.TERM_NETWORK_INTERNATIONAL)==0) {
			return "International";
		}
		
		return res;
	}	
	
	public static final String BIN_ONUS="U";
	public static final String BIN_OFFUS="F";
	public static final String BIN_INTERNATIONAL="I";
	
	public static String getBinName(String bin){
		String res = "";
		if (bin==null){
			return res;
		}
		
		if (bin.compareTo(BinTermCsts.BIN_ONUS)==0) {
			return "ON-US";
		}
		if (bin.compareTo(BinTermCsts.BIN_OFFUS)==0) {
			return "OFF-US";
		}
		if (bin.compareTo(BinTermCsts.BIN_INTERNATIONAL)==0) {
			return "International";
		}
		
		return res;
	}	
	
}
