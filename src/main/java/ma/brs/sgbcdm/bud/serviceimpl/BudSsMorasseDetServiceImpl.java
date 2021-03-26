package ma.brs.sgbcdm.bud.serviceimpl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.brs.sgbcdm.bud.domain.BudMorasseDet;
import ma.brs.sgbcdm.bud.domain.BudMorassePres;
import ma.brs.sgbcdm.bud.domain.BudSsMorasse;
import ma.brs.sgbcdm.bud.domain.BudSsMorasseDet;
import ma.brs.sgbcdm.bud.serviceapi.BudMorasseDetService;
import ma.brs.sgbcdm.bud.serviceapi.BudSsMorasseDetService;
import ma.brs.sgbcdm.bud.serviceapi.BudSsMorasseService;
import ma.brs.sgbcdm.par.domain.ParAgentExe;
import ma.brs.sgbcdm.par.domain.ParOrdonateur;
import ma.brs.sgbcdm.pla.domain.PlaCreditPrs;

/**
 * Implementation of BudSsMorasseDetService.
 */
@Service("budSsMorasseDetService")
public class BudSsMorasseDetServiceImpl extends BudSsMorasseDetServiceImplBase {

	private static final Logger logger = Logger.getLogger(BudSsMorasseDetServiceImpl.class);

	public BudSsMorasseDetServiceImpl() {
	}
	
	
	@Autowired
	private BudSsMorasseService budSsMorasseService;
	
	@Autowired
	private BudSsMorasseDetService budSsMorasseDetService;
	
	@Autowired
	private BudMorasseDetService budMorasseDetService;
	
	
	
	
	

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public void assignModToSmd(ServiceContext ctx, Long id, List<Long> mordIds) {
		

		BudSsMorasse smor = budSsMorasseService.findById(ctx, id, "");
		List<Long> unckecked = new ArrayList();
		for(BudSsMorasseDet smd : smor.getIdSmrSmdId()) {
			boolean ckecked = false;
			for(Long mordId : mordIds){
				BudMorasseDet mord = budMorasseDetService.findById(ctx, mordId, "");
				if(smd.getSmdModId().getId().equals(mord.getId())) {
					ckecked = true;
				}
			}
			if(!ckecked) {
				unckecked.add(smd.getId());
			}
		}
		
		for(Long smdId : unckecked) {
			BudSsMorasseDet smd = budSsMorasseDetService.findById(ctx, smdId, "");
			smor.removeIdSmrSmdId( smd);
			budSsMorasseDetService.delete(ctx, smd);
		}
		
		for(Long mordId : mordIds ){
			BudMorasseDet mord = budMorasseDetService.findById(ctx, mordId, "");
			
			boolean affected = false;
			for(BudSsMorasseDet smd : smor.getIdSmrSmdId()) {
				if(smd.getSmdModId().getId().equals(mord.getId())) {
					affected = true;
					break;
				}
			}
			
			if(!affected) {
				BudSsMorasseDet smd = new BudSsMorasseDet();
				
				smd.setSmdModId(mord);
				smd.setSmdSmrId(smor);
				System.out.println("mord : " + mord.getId());
				calculateCpCe(smd, smor);
				smd = budSsMorasseDetService.save(ctx, smd);
			}
		}
	
		
	}


	private void calculateCpCe(BudSsMorasseDet smd, BudSsMorasse smor) {
		
		BigDecimal smdCp = BigDecimal.ZERO;
		BigDecimal smdCe = BigDecimal.ZERO;
		for (BudMorassePres mpr : smd.getSmdModId().getIdModMprId()){
			System.out.println(mpr.getId());
			PlaCreditPrs cpr = mpr.getMprCprId();
			ParAgentExe aex = cpr.getCprAexId();
			ParOrdonateur aexOrd = aex.getAexOrdId();
			
			ParOrdonateur smrOrd = smor.getSmrOrdId();
			if(aexOrd.getId().equals(smrOrd.getId())) {
				//smd.addMprId(mpr);
				smdCp = smdCp.add(mpr.getMprCreditCp());
				smdCe = smdCe.add(mpr.getMprCreditCe());
			}
		}
		smd.setSmdCreditCp(smdCp);
		smd.setSmdCreditCe(smdCe);
		
	}

}
