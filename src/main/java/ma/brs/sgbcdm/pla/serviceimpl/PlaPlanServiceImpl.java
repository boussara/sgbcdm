package ma.brs.sgbcdm.pla.serviceimpl;

import java.math.BigDecimal;
import java.util.List;

import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.brs.sgbcdm.par.domain.ParExercice;
import ma.brs.sgbcdm.par.domain.ParRegion;
import ma.brs.sgbcdm.par.serviceapi.ParRegionService;
import ma.brs.sgbcdm.pla.domain.PlaBudgetType;
import ma.brs.sgbcdm.pla.domain.PlaCreditPrg;
import ma.brs.sgbcdm.pla.domain.PlaCreditPrj;
import ma.brs.sgbcdm.pla.domain.PlaCreditPrjReg;
import ma.brs.sgbcdm.pla.domain.PlaPlan;
import ma.brs.sgbcdm.pla.domain.PlaProgram;
import ma.brs.sgbcdm.pla.domain.PlaProject;
import ma.brs.sgbcdm.pla.serviceapi.PlaBudgetTypeService;
import ma.brs.sgbcdm.pla.serviceapi.PlaCreditPrgService;
import ma.brs.sgbcdm.pla.serviceapi.PlaCreditPrjRegService;
import ma.brs.sgbcdm.pla.serviceapi.PlaCreditPrjService;
import ma.brs.sgbcdm.pla.serviceapi.PlaProgramService;
import ma.brs.sgbcdm.pla.serviceapi.PlaProjectService;

/**
 * Implementation of PlaPlanService.
 */
@Service("plaPlanService")
public class PlaPlanServiceImpl extends PlaPlanServiceImplBase {

	private static final Logger logger = Logger.getLogger(PlaPlanServiceImpl.class);
	

	public PlaPlanServiceImpl() {
	}
	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	@Override
	public PlaPlan save(ServiceContext ctx, PlaPlan entity) {
		PlaPlan plaPlan = getPlaPlanRepository().save(entity);

		return plaPlan;
	}
}
