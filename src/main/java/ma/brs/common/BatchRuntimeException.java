package ma.brs.common;

public class BatchRuntimeException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer breCode;
	private String breMessage;
	
	public  BatchRuntimeException(Integer code, String message){
		super();
		this.breCode=code;
		this.breMessage=message;
	}
	
	public Integer getBreCode() {
		return breCode;
	}
	public void setBreCode(Integer breCode) {
		this.breCode = breCode;
	}
	public String getBreMessage() {
		return breMessage;
	}
	public void setBreMessage(String breMessage) {
		this.breMessage = breMessage;
	}
	
}
