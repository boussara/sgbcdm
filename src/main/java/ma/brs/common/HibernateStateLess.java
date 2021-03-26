package ma.brs.common;

import javax.persistence.EntityManager;

import org.hibernate.StatelessSession;

public interface HibernateStateLess {

	public StatelessSession getSessionStateless();

	public void openStateLessSession();

	public void closeStateLessSession();
	
	public EntityManager getEntityManager();
}