package ma.brs.sgbcdm.bud.serviceimpl;

import ma.brs.common.par.serviceapi.ParEntityCts;
import ma.brs.sgbcdm.ach.domain.AchAchat;
import ma.brs.sgbcdm.bud.domain.BudDemMvt;
import ma.brs.sgbcdm.bud.domain.BudDemMvtProperties;
import ma.brs.sgbcdm.bud.serviceapi.BudDemMvtCts;
import ma.brs.sgbcdm.bud.serviceapi.BudDemMvtDTO;
import ma.brs.sgbcdm.cpt.serviceapi.CptEntityCts;

import java.util.ArrayList;
import java.util.List;

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
 * Implementation of BudDemMvtService.
 */
@Service("budDemMvtService")
public class BudDemMvtServiceImpl extends BudDemMvtServiceImplBase {

	private static final Logger logger = Logger.getLogger(BudDemMvtServiceImpl.class);

	public BudDemMvtServiceImpl() {
	}

	@Transactional(readOnly = true)
	public PagedResult<BudDemMvt> getAllVir(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
				
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<BudDemMvt> getAllDeleg(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
				
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<BudDemMvt> getAllReduc(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
				
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<BudDemMvt> filterVir(ServiceContext ctx, BudDemMvtDTO aua, PagingParameter pagingParameter) {
		
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
				
				
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
		
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<BudDemMvt> filterDeleg(ServiceContext ctx, BudDemMvtDTO aua, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
				
				
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<BudDemMvt> filterReduc(ServiceContext ctx, BudDemMvtDTO aua, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
				
				
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtVirSGM(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SGM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtVirSP(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SP_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtVirTM(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.TM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtVirSGM(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SGM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtVirSP(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SP_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtVirTM(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.VIREMENT);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.TM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtDelegSGM(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SGM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtDelegSP(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SP_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtDelegTM(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.TM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtDelegSGM(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SGM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtDelegSP(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SP_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtDelegTM(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.DELEGATION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.TM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtReducSGM(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SGM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtReducSP(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SP_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> getAllMvtReducTM(ServiceContext ctx,
			PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.TM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtReducSGM(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SGM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtReducSP(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.SP_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Override
	public PagedResult<BudDemMvt> filterMvtReducTM(ServiceContext ctx,
			BudDemMvtDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(BudDemMvtProperties.dmvType(), BudDemMvtCts.REDUCTION);
		ConditionalCriteria conditionalCriteria2 =ConditionalCriteria.equal(BudDemMvtProperties.dmvEntId().id(), ParEntityCts.TM_ID);
		
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(conditionalCriteria2);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderAsc(new LeafProperty<BudDemMvt>("dmvDate", BudDemMvt.class)));
		PagedResult<BudDemMvt> res=getBudDemMvtRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

}
