
DROP TABLE tec_retenue_garantie CASCADE;
DROP TABLE tec_retenue_garantie_part CASCADE;

DROP SEQUENCE trgtenu_cet_X;--tec_retenue_garantie
DROP SEQUENCE traptrgtenu_cet_X;--tec_retenue_garantie_part

CREATE TABLE tec_retenue_garantie (
	trg_id bigint NOT NULL,
	trg_num character varying(32),
	trg_name character varying(128),
	trg_date timestamp without time zone,
	trg_cdp_id bigint NOT NULL,
	trg_att_id bigint NOT NULL,
	CREATED_DATE timestamp without time zone,
	CREATED_BY character varying(50),
	LAST_UPDATED timestamp without time zone,
	LAST_UPDATED_BY character varying(50),
	VERSION bigint NOT NULL
);

CREATE TABLE tec_retenue_garantie_part (
	rgp_id bigint NOT NULL,
	rgp_num character varying(32),
	rgp_name character varying(128),
	rgp_date timestamp without time zone,
	rgp_bank character varying(65),
	rgp_montant DOUBLE PRECISION,
	RGP_TRG_ID bigint,
	CREATED_DATE timestamp without time zone,
	CREATED_BY character varying(50),
	LAST_UPDATED timestamp without time zone,
	LAST_UPDATED_BY character varying(50),
	VERSION bigint NOT NULL
);

ALTER TABLE tec_retenue_garantie ADD CONSTRAINT PK_tec_retenue_garantie
	PRIMARY KEY (trg_id);
ALTER TABLE tec_retenue_garantie_part ADD CONSTRAINT PK_tec_retenue_garantie_part
	PRIMARY KEY (rgp_id);
	
-- Reference from RetenueGarantie.trgCdpId to CptDepense
ALTER TABLE tec_retenue_garantie ADD CONSTRAINT FK_tec_retenue_garantie_trg_cdp_id
	FOREIGN KEY (trg_cdp_id) REFERENCES cpt_depense (cdp_id);
CREATE INDEX IX_tec_retenue_garantie_trg_cdp_id ON tec_retenue_garantie (trg_cdp_id);

-- Reference from RetenueGarantie.trgAttId to TecAttachement
ALTER TABLE tec_retenue_garantie ADD CONSTRAINT FK_tec_retenue_garantie_trg_att_id
	FOREIGN KEY (trg_att_id) REFERENCES tec_attachement (tat_id);
CREATE INDEX IX_tec_retenue_garantie_trg_att_id ON tec_retenue_garantie (trg_att_id);

-- Reference from RetenueGarantiePart.rgpTrgId to RetenueGarantie
ALTER TABLE tec_retenue_garantie_part ADD CONSTRAINT FK_tec_retenue_garantie_part_RGP_TRG_ID
	FOREIGN KEY (RGP_TRG_ID) REFERENCES tec_retenue_garantie (trg_id);
CREATE INDEX IX_tec_retenue_garantie_part_RGP_TRG_ID ON tec_retenue_garantie_part (RGP_TRG_ID);