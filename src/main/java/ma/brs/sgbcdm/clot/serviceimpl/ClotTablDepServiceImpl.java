package ma.brs.sgbcdm.clot.serviceimpl;

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

import ma.brs.sgbcdm.clot.domain.ClotTablDep;
import ma.brs.sgbcdm.clot.domain.ClotTablDepProperties;
import ma.brs.sgbcdm.clot.serviceapi.ClotTablDepDTO;
import ma.brs.sgbcdm.cpt.domain.CptDepense;
import ma.brs.sgbcdm.cpt.serviceapi.CptDepenseCts;
import ma.brs.sgbcdm.cpt.serviceapi.CptEntityCts;

/**
 * Implementation of ClotTablDepService.
 */
@Service("clotTablDepService")
public class ClotTablDepServiceImpl extends ClotTablDepServiceImplBase {

	private static final Logger logger = Logger.getLogger(ClotTablDepServiceImpl.class);

	public ClotTablDepServiceImpl() {
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepMarkMarkSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();		
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepMarkSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepMarkCI(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepMarkTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepMarkSGM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepMarkSB(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepMarkCI(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepMarkTM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"M") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepAnnSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();		
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepAnnSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepAnnCI(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepAnnTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepAnnSGM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepAnnSB(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepAnnCI(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepAnnTM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"A") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepDimSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();		
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepDimSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepDimCI(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepDimTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepDimSGM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepDimSB(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepDimCI(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepDimTM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"D") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepConsSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();		
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepConsSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepConsCI(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepConsTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepConsSGM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepConsSB(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepConsCI(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepConsTM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"C") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepErcSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();		
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepErcSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepErcCI(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepErcTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepErcSGM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepErcSB(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepErcCI(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepErcTM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"E") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepRrcSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();		
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepRrcSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepRrcCI(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<ClotTablDep> getAllDepRrcTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));

		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepRrcSGM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepRrcSB(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepRrcCI(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<ClotTablDep> filterDepRrcTM(ServiceContext ctx, ClotTablDepDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdCurStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(ClotTablDepProperties.ctdType(),"R") );
		conditions.add(ConditionalCriteria.equal(ClotTablDepProperties.ctdCurCenId().id(),CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<ClotTablDep>("id", ClotTablDep.class)));
		PagedResult<ClotTablDep> res = getClotTablDepRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

}
