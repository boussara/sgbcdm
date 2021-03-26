package ma.brs.common.par.serviceimpl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.sculptor.framework.context.ServiceContext;
import org.springframework.stereotype.Service;

import ma.brs.common.par.domain.ParEntity;

/**
 * Implementation of ParEntityService.
 */
@Service("parEntityService")
public class ParEntityServiceImpl extends ParEntityServiceImplBase {

	private static final Logger logger = Logger.getLogger(ParEntityServiceImpl.class);

	public ParEntityServiceImpl() {
	}

	@Override
	public List<Integer> findChildIds4ParEntity(ServiceContext ctx,
			ParEntity parEntity) {
		if(parEntity==null)
			return null;
		
		
		ArrayList<Integer> ids = new ArrayList<Integer>();
		ids.add(parEntity.getId().intValue());
		
		List<ParEntity> childs = getParEntityRepository().findByParEntityParent(parEntity);
		
		if((childs==null)||(childs.isEmpty()))
			return ids;
		
		/*if(childs.contains(parEntity.getId())){ ????????
			childs.remove(parEntity.getId());
		}*/
		if(childs.contains(parEntity)){
			childs.remove(parEntity);
		}
		
		Iterator<ParEntity> it=childs.iterator();
		while(it.hasNext()){
			ids.addAll(findChildIds4ParEntity(ctx,it.next()));
		}
		
		return ids;
	}

}
