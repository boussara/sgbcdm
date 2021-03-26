package ma.brs.common;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Session;
import org.hibernate.StatelessSession;
import org.springframework.stereotype.Repository;

@Repository("hibernateStateLess")
public class HibernateStateLessImpl implements HibernateStateLess {
	
	private StatelessSession sessionStateless;
	
	@PersistenceContext(unitName = "SgbcdmEntityManagerFactory")
	private EntityManager entityManager;

	/**
	 * Dependency injection
	 */
	@PersistenceContext(unitName = "SgbcdmEntityManagerFactory")
	protected void setEntityManager(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	public EntityManager getEntityManager() {
		return entityManager;
	}

	@Override
	public StatelessSession getSessionStateless() {
		return sessionStateless;
	}

	public void setSessionStateless(StatelessSession sessionStateless) {
		this.sessionStateless = sessionStateless;
	}
	
	@Override
	public void openStateLessSession(){
		if(sessionStateless==null){
			Session sess=entityManager.unwrap(Session.class);
			sessionStateless=sess.getSessionFactory().openStatelessSession();
		}
	}
	
	@Override
	public void closeStateLessSession(){
		if(sessionStateless!=null)
			sessionStateless.close();
	}
	
}
