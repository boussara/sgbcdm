package ma.brs.sgbcdm.ach.serviceimpl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.brs.sgbcdm.ach.domain.AchEntity;
import ma.brs.sgbcdm.ach.domain.AchEntityBuilder;
import ma.brs.sgbcdm.ach.serviceapi.AchEntityCts;

/**
 * Implementation of AchEntityService.
 */
@Service("achEntityService")
public class AchEntityServiceImpl extends AchEntityServiceImplBase {

	private static final Logger logger = Logger.getLogger(AchEntityServiceImpl.class);

	public AchEntityServiceImpl() {
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public void init(ServiceContext ctx) {
		List<AchEntity> defaultParams = new ArrayList();
		AchEntity SGM = new AchEntity();
		SGM.setId(AchEntityCts.SGM_ID);
		SGM.setAenName("SGM");
		defaultParams.add(SGM);

		AchEntity SM = new AchEntity();
		SM.setId(AchEntityCts.SM_ID);
		SM.setAenName("SM");
		defaultParams.add(SM);

		AchEntity CI = new AchEntity();
		CI.setId(AchEntityCts.CI_ID);
		CI.setAenName("CI");
		defaultParams.add(CI);

		AchEntity TM = new AchEntity();
		TM.setId(AchEntityCts.TM_ID);
		TM.setAenName("TM");
		defaultParams.add(TM);
		
		for (AchEntity achEntity : defaultParams) {
			save(ctx, achEntity);
		}
		
		
	}

}
