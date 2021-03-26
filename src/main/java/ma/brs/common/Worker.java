package ma.brs.common;

import java.util.concurrent.Future;

import org.hibernate.jdbc.Work;

public interface Worker {
    public Future<Work> work();
}