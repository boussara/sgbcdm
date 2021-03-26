package ma.brs.sgbcdm.ach.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.sculptor.framework.accessapi.ConditionalCriteria;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.domain.LeafProperty;
import org.sculptor.framework.domain.PagedResult;
import org.sculptor.framework.domain.PagingParameter;
import org.springframework.stereotype.Service;

import ma.brs.sgbcdm.ach.domain.AchAchat;
import ma.brs.sgbcdm.ach.domain.AchAchatProperties;
import ma.brs.sgbcdm.ach.serviceapi.AchAchatCts;
import ma.brs.sgbcdm.ach.serviceapi.AchAchatDTO;
import ma.brs.sgbcdm.ach.serviceapi.AchEntityCts;
import ma.brs.sgbcdm.par.domain.ParExercice;

/**
 * Implementation of AchAchatService.
 */
@Service("achAchatService")
public class AchAchatServiceImpl extends AchAchatServiceImplBase {

	private static final Logger logger = Logger.getLogger(AchAchatServiceImpl.class);

	public AchAchatServiceImpl() {
	}

	
	// 14-03-2019	
	public PagedResult<AchAchat> getAllSGM(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.SGM_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

// 14-03-2019	
	public PagedResult<AchAchat> getAllSM(ServiceContext ctx, PagingParameter pagingParameter) {

		/*ConditionalCriteria conditionalCriteria =
				ConditionalCriteria.not(
						ConditionalCriteria.and(
								ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.SM_ID), 
								ConditionalCriteria.and( // or
										ConditionalCriteria.equal(AchAchatProperties.achCurStatus(), AchAchatCts.ON_GOING),
										ConditionalCriteria.equal(AchAchatProperties.achCurStatus(), AchAchatCts.MADE))
								)
				);*/
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.SM_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	
	}

	
	public PagedResult<AchAchat> getAllCI(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.CI_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	
	}

	
	public PagedResult<AchAchat> getAllTM(ServiceContext ctx, PagingParameter pagingParameter) {

		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.TM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	
	}
	public PagedResult<AchAchat> getAllAr(ServiceContext ctx, PagingParameter pagingParameter) {

		//ConditionalCriteria conditionalCriteria =ConditionalCriteria.isNotNull(AchAchatProperties.achCurDecision());
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.Ar_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	
	}

	public PagedResult<AchAchat> filterAr(ServiceContext ctx, AchAchatDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.Ar_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}
	
	public PagedResult<AchAchat> filterSGM(ServiceContext ctx, AchAchatDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.SGM_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	// 14-03-2019
	public PagedResult<AchAchat> filterSM(ServiceContext ctx, AchAchatDTO aua, PagingParameter pagingParameter) {
		/*ConditionalCriteria conditionalCriteria =
				ConditionalCriteria.not(
						ConditionalCriteria.and(
								ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.SM_ID), 
								ConditionalCriteria.or( 
										ConditionalCriteria.equal(AchAchatProperties.achCurStatus(), AchAchatCts.ON_GOING),
										ConditionalCriteria.equal(AchAchatProperties.achCurStatus(), AchAchatCts.MADE))
								)
				);*/
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.SM_ID);
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	
	public PagedResult<AchAchat> filterCI(ServiceContext ctx, AchAchatDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.CI_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

	
	public PagedResult<AchAchat> filterTM(ServiceContext ctx, AchAchatDTO aua, PagingParameter pagingParameter) {
		ConditionalCriteria conditionalCriteria =ConditionalCriteria.equal(AchAchatProperties.achCurAenId().id(), AchEntityCts.TM_ID);
		
		List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
		conditions.add(conditionalCriteria);
		conditions.addAll(prepareCondition(aua));
		conditions.add(ConditionalCriteria.orderDesc(new LeafProperty<AchAchat>("lastUpdated", AchAchat.class)));
		PagedResult<AchAchat> res=getAchAchatRepository().findByCondition(conditions, pagingParameter);
		
		return res;
	}

}
