package ma.brs.sgbcdm.bud.repositoryimpl;

import org.hibernate.FlushMode;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * Repository implementation for BudSsMorasse
 */
@Repository("budSsMorasseRepository")
public class BudSsMorasseRepositoryImpl extends BudSsMorasseRepositoryBase {
	public BudSsMorasseRepositoryImpl() {
	}

	public void flushSpecial() {
		getEntityManager().unwrap( Session.class ).setFlushMode( FlushMode.MANUAL );
	}
}
