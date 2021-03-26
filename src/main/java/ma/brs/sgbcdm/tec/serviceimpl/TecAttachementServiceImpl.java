package ma.brs.sgbcdm.tec.serviceimpl;

//import ma.brs.sgbcdm.cpt.domain.CptDepense;
//import ma.brs.sgbcdm.cpt.domain.CptDepenseProperties;
//import ma.brs.sgbcdm.cpt.serviceapi.CptDepenseCts;
import ma.brs.sgbcdm.cpt.serviceapi.CptEntityCts;
import ma.brs.sgbcdm.tec.domain.TecAttachement;
import ma.brs.sgbcdm.tec.domain.TecAttachementProperties;
import ma.brs.sgbcdm.tec.serviceapi.TecAttachementCts;
import ma.brs.sgbcdm.tec.serviceapi.TecAttachementDTO;

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
 * Implementation of TecAttachementService.
 */
@Service("tecAttachementService")
public class TecAttachementServiceImpl extends TecAttachementServiceImplBase {

	private static final Logger logger = Logger.getLogger(TecAttachementServiceImpl.class);

	public TecAttachementServiceImpl() {
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachBen(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.BEN_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}
	

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachBen(ServiceContext ctx, PagingParameter pagingParameter) {
		//throw new UnsupportedOperationException("getAllAttachBen not implemented");
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.BEN_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachSGM(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
		
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		//throw new UnsupportedOperationException("filterAttachSGM not implemented");
				List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
				//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
				conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.SGM_ID) );
				conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
				PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
				return res;
		
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachCer(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.SB_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachCer(ServiceContext ctx, PagingParameter pagingParameter) {
		//throw new UnsupportedOperationException("getAllAttachCer not implemented");
				List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
				//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
				conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.SB_ID) );
				conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
				PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
				return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachSB(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachSB(ServiceContext ctx, PagingParameter pagingParameter) {
		//throw new UnsupportedOperationException("getAllAttachSB not implemented");
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.SB_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachCI(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CI_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachCI(ServiceContext ctx, PagingParameter pagingParameter) {
		//throw new UnsupportedOperationException("getAllAttachCI not implemented");
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.CI_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachTM(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachTM(ServiceContext ctx, PagingParameter pagingParameter) {
		//throw new UnsupportedOperationException("getAllAttachTM not implemented");
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.TM_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}
	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachAr(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.Ar_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachAr(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.Ar_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}
	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<TecAttachement> filterAttachPD(ServiceContext ctx, TecAttachementDTO aua, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID));
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID));
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<TecAttachement> getAllAttachPD(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> filterAttachPDSGM(ServiceContext ctx, TecAttachementDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID));
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));		
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.SGM_ID));
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.SGM_ID), ConditionalCriteria.isNull(TecAttachementProperties.tatDpCurTenId().id())));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> getAllAttachPDSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.CER_ID) );
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.SGM_ID));		
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.SGM_ID), ConditionalCriteria.isNull(TecAttachementProperties.tatDpCurTenId().id())));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> filterAttachPDTM(ServiceContext ctx, TecAttachementDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID));
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.TM_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> getAllAttachPDTM(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.CER_ID) );
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.TM_ID));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> filterAttachPDCER(ServiceContext ctx, TecAttachementDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID));
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.CI_ID));
		//conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.CI_ID), ConditionalCriteria.isNull(TecAttachementProperties.tatDpCurTenId().id())));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> getAllAttachPDCER(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.CER_ID) );
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.CI_ID));
		//conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.CER_ID), ConditionalCriteria.isNull(TecAttachementProperties.tatDpCurTenId().id())));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> filterAttachPDSB(ServiceContext ctx, TecAttachementDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatStatus(), TecAttachementCts.DEMANDE));
		//conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID));
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}

	@Override
	public PagedResult<TecAttachement> getAllAttachPDSB(ServiceContext ctx, PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatStatus(),TecAttachementCts.DEMANDE) );
		//conditions.add( ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(),CptEntityCts.CER_ID) );
		conditions.add(ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.CER_ID),
				ConditionalCriteria.or(ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SGM_ID),ConditionalCriteria.equal(TecAttachementProperties.tatCurTenId().id(), CptEntityCts.SB_ID))));
		
		conditions.add(ConditionalCriteria.equal(TecAttachementProperties.tatDpCurTenId().id(), CptEntityCts.SB_ID));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<TecAttachement>("id", TecAttachement.class)));
		PagedResult<TecAttachement> res = getTecAttachementRepository().findByCondition(conditions, pagingParameter);
		return res;
	}
	
}
