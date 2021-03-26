package ma.brs.sgbcdm.pla.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import ma.brs.common.par.serviceapi.ParEntityCts;
import ma.brs.sgbcdm.bud.domain.BudDemMvt;
import ma.brs.sgbcdm.bud.domain.BudDemMvtProperties;
import ma.brs.sgbcdm.bud.serviceapi.BudDemMvtCts;
import ma.brs.sgbcdm.pla.domain.PlaCreditOpDemande;
import ma.brs.sgbcdm.pla.domain.PlaCreditOpDemandeProperties;
import ma.brs.sgbcdm.pla.serviceapi.PlaCreditOpDemandeDTO;

import org.apache.log4j.Logger;
import org.sculptor.framework.accessapi.ConditionalCriteria;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.domain.LeafProperty;
import org.sculptor.framework.domain.PagedResult;
import org.sculptor.framework.domain.PagingParameter;
import org.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of PlaCreditOpDemandeService.
 */
@Service("plaCreditOpDemandeService")
public class PlaCreditOpDemandeServiceImpl extends PlaCreditOpDemandeServiceImplBase {

	private static final Logger logger = Logger.getLogger(PlaCreditOpDemandeServiceImpl.class);

	public PlaCreditOpDemandeServiceImpl() {
	}

	@Transactional(readOnly = true)
	public PagedResult<PlaCreditOpDemande> getAllMvtSGM(ServiceContext ctx, PagingParameter pagingParameter) {		
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.SGM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<PlaCreditOpDemande> getAllMvtSP(ServiceContext ctx, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.SP_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<PlaCreditOpDemande> getAllMvtTM(ServiceContext ctx, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.TM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<PlaCreditOpDemande> filterMvtSGM(ServiceContext ctx, PlaCreditOpDemandeDTO aua,
			PagingParameter pagingParameter) {		
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.SGM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<PlaCreditOpDemande> filterMvtSP(ServiceContext ctx, PlaCreditOpDemandeDTO aua,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.SP_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<PlaCreditOpDemande> filterMvtTM(ServiceContext ctx, PlaCreditOpDemandeDTO aua,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.TM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<PlaCreditOpDemande> getAllMvtCI(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.CI_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<PlaCreditOpDemande> filterMvtCI(ServiceContext ctx,
			PlaCreditOpDemandeDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(PlaCreditOpDemandeProperties.codEntId().id(), ParEntityCts.CI_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<PlaCreditOpDemande>("createdDate", PlaCreditOpDemande.class)));
		PagedResult<PlaCreditOpDemande> res=getPlaCreditOpDemandeRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

}
