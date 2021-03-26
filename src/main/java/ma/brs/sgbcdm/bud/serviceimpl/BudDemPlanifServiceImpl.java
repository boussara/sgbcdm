package ma.brs.sgbcdm.bud.serviceimpl;

import ma.brs.sgbcdm.bud.domain.BudDemMvt;
import ma.brs.sgbcdm.bud.domain.BudDemMvtMpres;
import ma.brs.sgbcdm.bud.domain.BudDemPlanif;
import ma.brs.sgbcdm.bud.domain.BudDemPlanifMpres;
import ma.brs.sgbcdm.bud.domain.BudDemPlanifMpresHasPex;
import ma.brs.sgbcdm.bud.domain.BudDemPlanifNpres;
import ma.brs.sgbcdm.bud.domain.BudDemPlanifNpresHasPex;
import ma.brs.sgbcdm.bud.domain.BudDmmHasChp;
import ma.brs.sgbcdm.bud.domain.BudMorasseDet;
import ma.brs.sgbcdm.bud.domain.BudMorasseOp;
import ma.brs.sgbcdm.bud.domain.BudMorassePres;
import ma.brs.sgbcdm.bud.domain.BudMprHasChp;
import ma.brs.sgbcdm.bud.domain.BudSsMorasseDet;
import ma.brs.sgbcdm.bud.serviceapi.BudDemMvtMpresService;
import ma.brs.sgbcdm.bud.serviceapi.BudDemPlanifCts;
import ma.brs.sgbcdm.bud.serviceapi.BudDmmHasChpService;
import ma.brs.sgbcdm.bud.serviceapi.BudMorasseOpService;
import ma.brs.sgbcdm.bud.serviceapi.BudMorassePresService;
import ma.brs.sgbcdm.bud.serviceapi.BudMprHasChpService;
import ma.brs.sgbcdm.par.domain.ParAgentExe;
import ma.brs.sgbcdm.pla.domain.PlaCprHasPex;
import ma.brs.sgbcdm.pla.domain.PlaCreditOp;
import ma.brs.sgbcdm.pla.domain.PlaCreditPrs;
import ma.brs.sgbcdm.pla.serviceapi.PlaCreditOpService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of BudDemPlanifService.
 */
@Service("budDemPlanifService")
public class BudDemPlanifServiceImpl extends BudDemPlanifServiceImplBase {

	private static final Logger logger = Logger.getLogger(BudDemPlanifServiceImpl.class);
	
	
	@Autowired
	public PlaCreditOpService plaCreditOpService;

	@Autowired
	public BudMorasseOpService budMorasseOpService;
	
	@Autowired private BudMorassePresService budMorassePresService;
	@Autowired private BudMprHasChpService budMprHasChpService;
	

	@Autowired private BudDemMvtMpresService budDemMvtMpresService;
	@Autowired private BudDmmHasChpService budDmmHasChpService;


	public BudDemPlanifServiceImpl() {
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public void migrateOp(ServiceContext ctx, BudDemPlanif dep) {

		PlaCreditOp cop = dep.getDepCopId();
		cop.setCopStatus("A");
		cop.setCopBdtId(dep.getDepSmdId().getSmdModId().getModMorId().getMorBdtId());
		cop.setCopPexId(dep.getDepSmdId().getSmdModId().getModMorId().getMorPexId());
		cop = plaCreditOpService.save(ctx, cop);
		
		
		BudMorasseOp mop = new BudMorasseOp();
		mop.setMopCopId(cop);
		mop.setMopModId(dep.getDepSmdId().getSmdModId());
		mop.setMopCredit(mop.getMopCredit());
		mop = budMorasseOpService.save(ctx, mop);
		
		
		
		if(cop.getIdCopCprId() != null){

			for(PlaCreditPrs pres : cop.getIdCopCprId()){
				BudMorassePres mpr = new BudMorassePres();
				
				mpr.setMprMopId(mop);
				mpr.setMprCprId(pres);
				
				BigDecimal cp = BigDecimal.ZERO;
				BigDecimal ce = BigDecimal.ZERO;
				for( PlaCprHasPex chp : pres.getIdCprChpId()){
					
					if(chp.getChpPexId().getPexCode().equals(mop.getMopModId().getModMorId().getMorPexId().getPexCode())){
						cp = cp.add(chp.getChpCredit());
					}else{
						ce = ce.add(chp.getChpCredit());							
					}
					
				}
				mpr.setMprCreditCp(cp);
				mpr.setMprCreditCe(ce);
				//mpr.setMprCreditCp(BigDecimal.ZERO);
				//mpr.setMprCreditCe(BigDecimal.ZERO);
				
				mpr = budMorassePresService.save(ctx, mpr);

				for( PlaCprHasPex chp : pres.getIdCprChpId()){
					BudMprHasChp mhc = new BudMprHasChp();
					mhc.setMhcMprId(mpr);
					mhc.setMhcChpId(chp);
					
					mhc.setMhcOldCredit(chp.getChpCredit());
					mhc.setMhcNewCredit(BigDecimal.ZERO);
					
					mhc = budMprHasChpService.save(ctx, mhc);
				}
				
			}
		}
		
		dep.setDepMopId(mop);
		dep.setDepStatus(BudDemPlanifCts.MIGRATED);
		dep = save(ctx, dep);
		
		budMorassePresService.flush();
	
	}

	
	private void addMprToSmd(ServiceContext ctx, BudSsMorasseDet smd, BudMorassePres modMpr) {
		

		BudMorassePres mpr = new BudMorassePres();
		
		//mpr.setMprMopId(modMpr.getMprMopId());
		mpr.setMprCprId(modMpr.getMprCprId());
		
		mpr.setMprCreditCp(modMpr.getMprCreditCp());
		mpr.setMprCreditCe(modMpr.getMprCreditCe());
		
		mpr.setMprSmdId(smd);
		mpr.setMprPmprId(modMpr);
		
		
		smd.setSmdCreditCp(smd.getSmdCreditCp().add(modMpr.getMprCreditCp()));
		smd.setSmdCreditCe(smd.getSmdCreditCe().add(modMpr.getMprCreditCe()));
		
		smd.getSmdModId().setModCreditCp(smd.getSmdModId().getModCreditCp().add(modMpr.getMprCreditCp()));
		smd.getSmdModId().setModCreditCe(smd.getSmdModId().getModCreditCe().add(modMpr.getMprCreditCe()));
		
		mpr = budMorassePresService.save(ctx, mpr);
		
		
		
		System.out.println("modMpr: " + modMpr);
		System.out.println("mpr: " + mpr);
		List<BudMprHasChp> mprMhcs = budMprHasChpService.findByMhcMprId(ctx, modMpr.getId());
		if(mprMhcs == null) {
			mprMhcs = new ArrayList();
		}
		System.out.println("mprMhcs: "+ mprMhcs.size());
		for( BudMprHasChp modMhc : mprMhcs){
			BudMprHasChp mhc = new BudMprHasChp();
			mhc.setMhcMprId(mpr);
			mhc.setMhcChpId(modMhc.getMhcChpId());
			mhc.setMhcOldCredit(modMhc.getMhcOldCredit());
			mhc.setMhcNewCredit(modMhc.getMhcNewCredit());
			mhc = budMprHasChpService.save(ctx, mhc);
		}
		
	}
	
	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public void linkPrs(ServiceContext ctx, BudDemPlanif dep) {
		for(BudDemPlanifNpres dpd : dep.getIdDepDpdId()){
			if(dpd.getDpdSmdId() != null){
				
				BudMorasseDet mord = dpd.getDpdSmdId().getSmdModId();
				ParAgentExe aex = dep.getDepAexId();
				
				
				BudMorassePres dmmMpr = null;
				List<BudMorassePres> mprlist = budMorassePresService.findByMopId(ctx, dep.getDepMopId().getId());
				
				for(BudMorassePres mpr : mprlist){
					if(mpr.getMprCprId().getId().equals(dpd.getDpdCprId().getId())) {
						dmmMpr = mpr;
					}
				}
				
				// TODO: link prs
				if(dmmMpr.getMprModId() == null) {
					
					dmmMpr.setMprModId(mord);
					dmmMpr.setMprStatus("A");
					
					dmmMpr.setMprAexId(aex);
					
					dmmMpr = budMorassePresService.save(ctx, dmmMpr);
					
					addMprToSmd(ctx, dpd.getDpdSmdId(), dmmMpr);
				}
			}
		}
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public void createDmmForDpp(ServiceContext ctx, BudDemMvt demMvt, BudDemPlanifMpres dpp) {
		

		BudDemMvtMpres dmm = null;
		
		List<BudDemMvtMpres> dmvDmms = budDemMvtMpresService.findByDmmDmvId(ctx, demMvt.getId());
		for(BudDemMvtMpres demMvtDmm : dmvDmms) {
			if(demMvtDmm.getDmmMprId().getId().equals(dpp.getDppMprId().getId())) {
				dmm = demMvtDmm;
			}
		}
		
		
		dmm.setDmmDmvId(demMvt);
		dmm.setDmmSmdId(dpp.getDppSmdId());
		dmm.setDmmMprId(dpp.getDppMprId());
		dmm.setDmmOldCp(dpp.getDppOldCp());
		dmm.setDmmOldCe(dpp.getDppOldCe());
		dmm.setDmmNewCp(dpp.getDppNewCp());
		dmm.setDmmNewCe(dpp.getDppNewCe());
		dmm = budDemMvtMpresService.save(ctx, dmm);
		
		for( BudDemPlanifMpresHasPex mhp : dpp.getIdDppMhpId() ){

			BudDmmHasChp mhc = null;
			
			List<BudDmmHasChp> dmmMhcs = budDmmHasChpService.findByMhcDmmId(ctx, dmm.getId());
			if(dmmMhcs == null){
				dmmMhcs = new ArrayList();
			}
				
			for(BudDmmHasChp dmmMhc : dmmMhcs ) {
				
				if(dmmMhc.getMhcChpId().getId().equals(mhp.getMhpChpId().getId())) {
					mhc = dmmMhc;
				}
			}
			
			
			mhc.setMhcOldCredit(mhp.getMhpOldCredit());
			mhc.setMhcNewCredit(mhp.getMhpNewCredit());
			mhc = budDmmHasChpService.save(ctx, mhc); 
		}

		
		//dpp.setPlanifStatus(BudDemPlanifCts.DPP_DMM_CREATED);
		//dpp = budDemPlanifMpresService.save(serviceContext(), dpp);
	}

	@Transactional(readOnly = false, rollbackFor = ApplicationException.class)
	public void createDmmForDpd(ServiceContext ctx, BudDemPlanifNpres dpd, BudDemMvt demMvt, BudDemPlanif dep) {

		BigDecimal dpdCp = BigDecimal.ZERO;
		BigDecimal dpdCe = BigDecimal.ZERO;
		
		System.out.println(dpd.getIdDpdNhpId().size());
		
		for( BudDemPlanifNpresHasPex nhp : dpd.getIdDpdNhpId() ){
			if(nhp.getNhpChpId().getChpPexId().getPexCode().equals(dep.getDepSmdId().getSmdSmrId().getSmrMorId().getMorPexId().getPexCode())){
				dpdCp = dpdCp.add(nhp.getNhpNewCredit());
			}else{
				dpdCe = dpdCe.add(nhp.getNhpNewCredit());							
			}
			
		}
		System.out.println("dpdCp: "+dpdCp+" , dpdCe: "+dpdCe);
		if(dpdCp.add(dpdCe).compareTo(BigDecimal.ZERO) <= 0) {
			return;
		}
		
		BudDemMvtMpres dmm = null;
		
		List<BudDemMvtMpres> dmvDmms = budDemMvtMpresService.findByDmmDmvId(ctx, demMvt.getId());
		for(BudDemMvtMpres demMvtDmm : dmvDmms) {
			if(demMvtDmm.getDmmMprId().getMprCprId().getId().equals(dpd.getDpdCprId().getId())) {
				dmm = demMvtDmm;
			}
		}
		
		dmm.setDmmNewCp(dpdCp);
		dmm.setDmmNewCe(dpdCe);
		dmm = budDemMvtMpresService.save(ctx, dmm);
		

		for( BudDemPlanifNpresHasPex nhp : dpd.getIdDpdNhpId() ){
			BudDmmHasChp mhc = null;
			
			List<BudDmmHasChp> dmmMhcs = budDmmHasChpService.findByMhcDmmId(ctx, dmm.getId());
			if(dmmMhcs == null){
				dmmMhcs = new ArrayList();
			}
				
			for(BudDmmHasChp dmmMhc : dmmMhcs ) {
				
				if(dmmMhc.getMhcChpId().getId().equals(nhp.getNhpChpId().getId())) {
					mhc = dmmMhc;
				}
			}
			if(mhc == null) {
				
			}
			
			mhc.setMhcNewCredit(nhp.getNhpNewCredit());
			mhc = budDmmHasChpService.save(ctx, mhc); 
		}
		
		
		//dpd.setPlanifStatus(BudDemPlanifCts.DPD_DMM_CREATED);
		//dpd = budDemPlanifNpresService.save(serviceContext(), dpd);
	}

}
