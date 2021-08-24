SELECT * from pg_stat_activity WHERE state = $1 AND wait_event_type = $2;
