DROP TABLE ejr_cassette CASCADE CONSTRAINTS PURGE;
DROP TABLE ejr_cas_notif CASCADE CONSTRAINTS PURGE;
DROP TABLE ejr_count_clear CASCADE CONSTRAINTS PURGE;

DROP SEQUENCE cas_ettessac_rje_X;--ejr_cassette
DROP SEQUENCE can_fiton_sac_rje_X;--ejr_cas_notif
DROP SEQUENCE coc_raelc_tnouc_rje_X;--ejr_count_clear

CREATE SEQUENCE cas_ettessac_rje_X ; --MAXVALUE 99999999999999999 CYCLE --ejr_cassette 
CREATE SEQUENCE can_fiton_sac_rje_X ; --MAXVALUE 99999999999999999 CYCLE --ejr_cas_notif 
CREATE SEQUENCE coc_raelc_tnouc_rje_X ; --MAXVALUE 99999999999999999 CYCLE --ejr_count_clear 


CREATE TABLE ejr_cassette (
	cas_id NUMBER(19) NOT NULL,
	cas_date DATE,
	cas_order NUMBER(10),
	cas_notes NUMBER(10),
	cas_status NUMBER(10),
	cas_ne_id NUMBER(19),
	CREATED_DATE DATE,
	CREATED_BY VARCHAR2(50 CHAR ),
	LAST_UPDATED DATE,
	LAST_UPDATED_BY VARCHAR2(50 CHAR ),
	VERSION NUMBER(19) NOT NULL
);

CREATE TABLE ejr_cas_notif (
	can_id NUMBER(19) NOT NULL,
	can_date DATE,
	can_seuil NUMBER(10),
	can_etat VARCHAR2(100 CHAR ),
	can_ne_id NUMBER(19),
	CREATED_DATE DATE,
	CREATED_BY VARCHAR2(50 CHAR ),
	LAST_UPDATED DATE,
	LAST_UPDATED_BY VARCHAR2(50 CHAR ),
	VERSION NUMBER(19) NOT NULL
);

CREATE TABLE ejr_count_clear (
	coc_id NUMBER(19) NOT NULL,
	coc_date DATE,
	coc_type NUMBER(10),
	coc_nombre NUMBER(10),
	coc_clear_date DATE,
	coc_ne_id NUMBER(19),
	CREATED_DATE DATE,
	CREATED_BY VARCHAR2(50 CHAR ),
	LAST_UPDATED DATE,
	LAST_UPDATED_BY VARCHAR2(50 CHAR ),
	VERSION NUMBER(19) NOT NULL
);


ALTER TABLE ejr_cassette ADD CONSTRAINT PK_ejr_cassette
	PRIMARY KEY (cas_id);
ALTER TABLE ejr_cas_notif ADD CONSTRAINT PK_ejr_cas_notif
	PRIMARY KEY (can_id);
ALTER TABLE ejr_count_clear ADD CONSTRAINT PK_ejr_count_clear
	PRIMARY KEY (coc_id);
	
-- Reference from EjrCassette.casNeId to TopNe
ALTER TABLE ejr_cassette ADD CONSTRAINT FK_ejr_cassette_cas_ne_id
	FOREIGN KEY (cas_ne_id) REFERENCES TOP_NE (NE_ID);
CREATE INDEX IX_ejr_cassette_cas_ne_id ON ejr_cassette (cas_ne_id);

-- Reference from EjrCasNotif.canNeId to TopNe
ALTER TABLE ejr_cas_notif ADD CONSTRAINT FK_ejr_cas_notif_can_ne_id
	FOREIGN KEY (can_ne_id) REFERENCES TOP_NE (NE_ID);
CREATE INDEX IX_ejr_cas_notif_can_ne_id ON ejr_cas_notif (can_ne_id);

-- Reference from EjrCountClear.cocNeId to TopNe
ALTER TABLE ejr_count_clear ADD CONSTRAINT FK_ejr_count_clear_coc_ne_id
	FOREIGN KEY (coc_ne_id) REFERENCES TOP_NE (NE_ID);
CREATE INDEX IX_ejr_count_clear_coc_ne_id ON ejr_count_clear (coc_ne_id);

-- Index