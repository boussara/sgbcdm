2019-06-21 16:07:17.501|27|statement|connection 41|select usausr0_.UAR_USA_ID as UAR_USA_1_4_1_, usausr0_.UAR_USR_ID as UAR_USR_2_5_1_, admuserrol1_.USR_ID as USR_ID1_8_0_, admuserrol1_.CREATED_BY as CREATED_2_8_0_, admuserrol1_.CREATED_DATE as CREATED_3_8_0_, admuserrol1_.LAST_UPDATED as LAST_UPD4_8_0_, admuserrol1_.LAST_UPDATED_BY as LAST_UPD5_8_0_, admuserrol1_.USR_DESCRIPTION as USR_DESC6_8_0_, admuserrol1_.USR_NAME as USR_NAME7_8_0_, admuserrol1_.VERSION as VERSION8_8_0_ from ADM_USER_ACC_ROLE usausr0_ inner join ADM_USER_ROLE admuserrol1_ on usausr0_.UAR_USR_ID=admuserrol1_.USR_ID where usausr0_.UAR_USA_ID=?|select usausr0_.UAR_USA_ID as UAR_USA_1_4_1_, usausr0_.UAR_USR_ID as UAR_USR_2_5_1_, admuserrol1_.USR_ID as USR_ID1_8_0_, admuserrol1_.CREATED_BY as CREATED_2_8_0_, admuserrol1_.CREATED_DATE as CREATED_3_8_0_, admuserrol1_.LAST_UPDATED as LAST_UPD4_8_0_, admuserrol1_.LAST_UPDATED_BY as LAST_UPD5_8_0_, admuserrol1_.USR_DESCRIPTION as USR_DESC6_8_0_, admuserrol1_.USR_NAME as USR_NAME7_8_0_, admuserrol1_.VERSION as VERSION8_8_0_ from ADM_USER_ACC_ROLE usausr0_ inner join ADM_USER_ROLE admuserrol1_ on usausr0_.UAR_USR_ID=admuserrol1_.USR_ID where usausr0_.UAR_USA_ID=99680
2019-06-21 16:07:17.514|6|statement|connection 41|
select admusrapf0_.USP_ID as USP_ID1_9_, admusrapf0_.USP_APF_ID as USP_APF12_9_, admusrapf0_.USP_APF_MENU_ID as USP_APF_2_9_, admusrapf0_.USP_ASPDF as USP_ASPD3_9_, admusrapf0_.USP_CREATE as USP_CREA4_9_, admusrapf0_.USP_DELETE as USP_DELE5_9_, admusrapf0_.USP_EXPORT as USP_EXPO6_9_, admusrapf0_.USP_READ as USP_READ7_9_, admusrapf0_.USP_REPORT as USP_REPO8_9_, admusrapf0_.USP_UPDATE as USP_UPDA9_9_, admusrapf0_.USP_USR_ID as USP_USR13_9_, admusrapf0_.USP_VALIDATE as USP_VAL10_9_, admusrapf0_.USP_VERIFY as USP_VER11_9_ from ADM_USR_APF admusrapf0_ where admusrapf0_.USP_USR_ID=? and admusrapf0_.USP_APF_ID=?|
select admusrapf0_.USP_ID as USP_ID1_9_, admusrapf0_.USP_APF_ID as USP_APF12_9_, admusrapf0_.USP_APF_MENU_ID as USP_APF_2_9_, admusrapf0_.USP_ASPDF as USP_ASPD3_9_, admusrapf0_.USP_CREATE as USP_CREA4_9_, admusrapf0_.USP_DELETE as USP_DELE5_9_, admusrapf0_.USP_EXPORT as USP_EXPO6_9_, admusrapf0_.USP_READ as USP_READ7_9_, admusrapf0_.USP_REPORT as USP_REPO8_9_, admusrapf0_.USP_UPDATE as USP_UPDA9_9_, admusrapf0_.USP_USR_ID as USP_USR13_9_, admusrapf0_.USP_VALIDATE as USP_VAL10_9_, admusrapf0_.USP_VERIFY as USP_VER11_9_ 
from ADM_USR_APF admusrapf0_ 
where admusrapf0_.USP_USR_ID=188142 and admusrapf0_.USP_APF_ID=79002


select usausr0_.UAR_USA_ID as UAR_USA_1_4_1_, usausr0_.UAR_USR_ID as UAR_USR_2_5_1_, admuserrol1_.USR_ID as USR_ID1_8_0_, admuserrol1_.CREATED_BY as CREATED_2_8_0_, admuserrol1_.CREATED_DATE as CREATED_3_8_0_, admuserrol1_.LAST_UPDATED as LAST_UPD4_8_0_, admuserrol1_.LAST_UPDATED_BY as LAST_UPD5_8_0_, admuserrol1_.USR_DESCRIPTION as USR_DESC6_8_0_, admuserrol1_.USR_NAME as USR_NAME7_8_0_, admuserrol1_.VERSION as VERSION8_8_0_ 
from ADM_USER_ACC_ROLE usausr0_ inner join ADM_USER_ROLE admuserrol1_ on usausr0_.UAR_USR_ID=admuserrol1_.USR_ID 
where usausr0_.UAR_USA_ID=99680