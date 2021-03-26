package ma.brs.sgbcdm.cpt.serviceimpl;

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

import ma.brs.sgbcdm.cpt.domain.CptDepense;
import ma.brs.sgbcdm.cpt.domain.CptDepenseProperties;
import ma.brs.sgbcdm.cpt.serviceapi.CptDepenseCts;
import ma.brs.sgbcdm.cpt.serviceapi.CptDepenseDTO;
import ma.brs.sgbcdm.cpt.serviceapi.CptEntityCts;

/**
 * Implementation of CptDepenseService.
 */
@Service("cptDepenseService")
public class CptDepenseServiceImpl extends CptDepenseServiceImplBase {

	private static final Logger logger = Logger.getLogger(CptDepenseServiceImpl.class);

	public CptDepenseServiceImpl() {
	}

	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepEng(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.ENGAGEMENT);

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepEnr(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.ENREGISTREMENT);

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepApp(ServiceContext ctx, PagingParameter pagingParameter) {
		/*ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.APPR);*/
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.APPR) );
		//conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.TM_ID)); 11/09/2019
		
		//List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		// conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepDemande(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.DEMANDE);

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}
	
	


	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepSGM(ServiceContext ctx, PagingParameter pagingParameter) {

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}


	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepSM(ServiceContext ctx, PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SM_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}


	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepSB(ServiceContext ctx, PagingParameter pagingParameter) {

		

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}


	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepCI(ServiceContext ctx, PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
	
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.CI_ID),ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}
	

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepCI(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.CI_ID),ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );		
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}


	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepTM(ServiceContext ctx, PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.TM_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepAr(ServiceContext ctx, PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		//conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.Ar_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}
	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepAr(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		//conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.Ar_ID));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}
	
	
	
	
	

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepEng(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.ENGAGEMENT);

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepEnr(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.ENREGISTREMENT);

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}
//14-03-2019
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepApp(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		/*ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.APPR);*/
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.APPR) );
		//conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.TM_ID)); 11/09/2019

		//List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		//conditions.add(conditionalCriteria);
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}


	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepDemande(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria = ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),
				CptDepenseCts.DEMANDE);

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}

	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepSGM(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		conditions.add( ConditionalCriteria.or(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_ID),ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_CI_ID) ) );
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepSM(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.SM_ID));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepSB(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.SB_ID));
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepTM(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.TM_ID));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}

	@Override
	public PagedResult<CptDepense> getAllOrdreService(ServiceContext ctx, PagingParameter pagingParameter) {
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.OR_SER) );
		//conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SB_ID) );
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Override
	public PagedResult<CptDepense> filterOrdreService(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.OR_SER));
		//conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.TM_ID));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}
	
	@Override
	public PagedResult<CptDepense> getAllOrdreServiceSB(ServiceContext ctx, PagingParameter pagingParameter) {
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.OR_SER) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SB_ID) );
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Override
	public PagedResult<CptDepense> filterOrdreServiceSB(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.OR_SER));
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.SB_ID));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}
	
	@Override
	public PagedResult<CptDepense> getAllOrdreServiceSGM(ServiceContext ctx, PagingParameter pagingParameter) {
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.OR_SER) );
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.SGM_ID));
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}

	@Override
	public PagedResult<CptDepense> filterOrdreServiceSGM(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.OR_SER));
		conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.SGM_ID));
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}
	
	@Transactional(readOnly = true)
	public PagedResult<CptDepense> getAllDepenceRP(ServiceContext ctx, PagingParameter pagingParameter) {


		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		//conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.DEMANDE) );
		//conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.CER_ID) );
		
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.OR_SER) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_ID) );
		
		
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));

		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;
	}
	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public PagedResult<CptDepense> filterDepenceRP(ServiceContext ctx, CptDepenseDTO aua,
			PagingParameter pagingParameter) {

		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();

		//conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(), CptDepenseCts.DEMANDE));
		//conditions.add(ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(), CptEntityCts.CER_ID));
		
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpStatus(),CptDepenseCts.OR_SER) );
		conditions.add( ConditionalCriteria.equal(CptDepenseProperties.cdpCurCenId().id(),CptEntityCts.SGM_ID) );
		
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<CptDepense>("id", CptDepense.class)));
		PagedResult<CptDepense> res = getCptDepenseRepository().findByCondition(conditions, pagingParameter);

		return res;

	}
	

	
}
