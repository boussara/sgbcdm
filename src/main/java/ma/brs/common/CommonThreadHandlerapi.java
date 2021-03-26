package ma.brs.common;

public interface CommonThreadHandlerapi {

	public void list();
	
	public void addThread(String name,Thread t);
	
	public void stopThread(String name);
	
	public boolean check(String name);
}
