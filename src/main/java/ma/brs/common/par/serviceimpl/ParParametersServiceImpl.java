package ma.brs.common.par.serviceimpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.sculptor.framework.domain.PagedResult;
import org.sculptor.framework.domain.PagingParameter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.brs.common.par.domain.ParEntity;
import ma.brs.common.par.domain.ParParameters;
import ma.brs.common.par.serviceapi.ParParametersDTO;

/**
 * Implementation of ParParametersService.
 */
@Service("parParametersService")
public class ParParametersServiceImpl extends ParParametersServiceImplBase {

	private static final Logger logger = Logger.getLogger(ParParametersServiceImpl.class);

	public ParParametersServiceImpl() {
	}

	@Transactional(readOnly = true)
	public ParParameters getParParameters4Key(ServiceContext ctx, ParEntity parEntity, String key) {
		if((key==null)||(key.length()<1))
			return null; 
		
		
		List<ParParameters> params=null;
		
		ParParametersDTO dto=new ParParametersDTO();
		dto.setParKey(key);
		if(parEntity!=null)
			dto.setParEntId(parEntity.getId()+"");
		PagedResult<ParParameters> res=search(ctx,dto,PagingParameter.noLimits());
		
		if(res!=null && res.getValues()!=null && !res.getValues().isEmpty())
			params=res.getValues();
		if((params==null)||(params.isEmpty()))
			return null;
		
		return params.get(0);
	}

}
