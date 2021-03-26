/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package server.loganalyser;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import db.entity.BrsArreteCentral;
import db.entity.BrsCashCounter;
import db.entity.BrsCassette;
import db.entity.BrsCoffreEvent;
import db.entity.BrsCountClear;
import db.entity.BrsGab;
import db.entity.BrsGabRefresh;
import db.entity.BrsLostFiles;
import db.entity.BrsTransaction;
import db.manager.CashCounterManager;
import db.manager.CassetteManager;
import db.manager.CoffreManager;
import db.manager.CountClearManager;
import db.manager.GabRefreshManager;
import db.manager.LostfilesManager;
import db.manager.TransactionManager;
import tools.CommonUtil;
/**
 *
 * @author Administrator
 * Historique des changement
 * Bug 662 - Duplication événement coffre
 */
public class WincorLogAnalyser extends LogAnalyser{

    private static Log log = LogFactory.getLog(StigmaLogAnalyser.class);
    private String lastDateFormat ="";
    private String lastCashFileName="";
    private int lastCashLine=0;
    private boolean cashCleard=false;
    private String lastProcessedLine="";
    //constructor
    public WincorLogAnalyser(BrsGab dbGab)
    {
        super(dbGab);
    }

    @Override
    protected int setLogDirs()
    {
        int ok = 1;
        int ko = 0;

        if (logDirMap.length()<1)
        {
            log.error("logDirMap not set for gab :"+this.dbGab.getGabCode());
            return ko;
        }

        this.dbGab.setGabLogDir(logDirMap+"/E_Journal");
        this.dbGab.setGabCurLogDir(logDirMap+"/Program Files/NCR APTRA/Advance NDC/Data/");

        return ok;
    }

    @Override
     protected String getDateFromFileName(String fileName){
        String fileDate="";
        if (fileName.compareTo("EJDATA.LOG")==0)
        {
            Date now = CommonUtil.getInsatance().newDate();
            Date tomorrow = new Date(now.getTime()+86400000);
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
            fileDate=format.format(tomorrow);
        }
        else
        {
            if(fileName.length()==17)
            {
                fileDate = fileName.substring(3,7)+fileName.substring(8,10)+fileName.substring(11,13);
                int value = 0;
                try{
                    value = Integer.parseInt(fileDate);
                } catch(Exception e)
                {
                    value=-1;
                }
                if(value<=0)
                    fileDate="";
            }
        }
        return fileDate;
    }

    @Override
    protected String getFileNameForDate(Date fDate)
    {
        String fName="";

        if(fDate==null)
            return fName;

        Date fileDate = new Date(fDate.getTime()+86400000);
        
        //EJ_2010_09_03.txt        
        SimpleDateFormat format = new SimpleDateFormat("yyyy_MM_dd");
        fName="EJ_"+format.format(fileDate)+".txt";
                
        return fName;
    }


    @Override
    protected String determineCurrentFile()
    {
        //BrsGabRefresh lastRef = (new GabRefreshManager()).getLast(dbGab.getGabId());
        int garDateInt=0;
        /*if (lastRef!= null)
        {
            this.lastLine=lastRef.getGarLastLine();
            if (lastRef.getGarLastFile().length()!=0)
            {
                if (lastRef.getGarLastFile().compareTo("EJDATA.LOG")!=0)
                    return lastRef.getGarLastFile();

                SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
                String garDateStr ="";
                if (lastRef.getGarLastEvent()!=null)
                    garDateStr = format.format(lastRef.getGarLastEvent());
                else
                    garDateStr = format.format(lastRef.getGarTime());

                garDateInt=Integer.parseInt(garDateStr);
            }
        }
        else*/
            this.lastLine=0;

        String dir = dbGab.getGabLogDir();
        if (dir.length()==0)
        {
            log.error("Log directory not set  for gab :"+dbGab.getGabCode());
            return "";
        }

        File folder = new File(dir);
        File[] listOfFiles = folder.listFiles();

        if ((listOfFiles==null) || (listOfFiles.length==0))
        {
            log.error("Log directory ("+dir+") unreachable or empty  for gab :"+dbGab.getGabCode());
            return "EJDATA.LOG";
        }

        // Boucle sur la liste des fichiers
        int date = 30000000;
        int dateDeb=0;
        if (dbGab.getGabDateDebut()!=null)
        {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
            String dateDebStr =dateFormat.format(dbGab.getGabDateDebut());
            dateDeb=Integer.parseInt(dateDebStr);
        }
        if (garDateInt>dateDeb)
            dateDeb=garDateInt;

        String firstFileName ="";
        for (int i = 0; i < listOfFiles.length; i++) {
          if (listOfFiles[i].isFile())
          {
               if ((listOfFiles[i].getName().startsWith("EJ_")) && (listOfFiles[i].getName().endsWith("txt")))
               {
                  //EJ_2010_05_22.txt
                  String fileDate = this.getDateFromFileName(listOfFiles[i].getName());
                  if((fileDate!=null)&&(fileDate.length()>0))
                  {
                      if ((Integer.parseInt(fileDate)<date)&&(Integer.parseInt(fileDate)>dateDeb))
                      {
                          date = Integer.parseInt(fileDate);
                          firstFileName=listOfFiles[i].getName();
                      }
                  }
               }
          }
        }

        if (firstFileName.length()==0)
            firstFileName="EJDATA.LOG";

        return firstFileName;
    }


    @Override
    protected int buildNextFiles()
    {
        // Si pas de fichier courrant
        if (this.getCurrentFile().length()==0)
        {
            return 0;
        }
        if (this.getCurrentFile().compareTo("EJDATA.LOG")==0)
        {
            return 0;
        }

        // La date d aujourdhui
         String currFileDateString = this.getDateFromFileName(this.getCurrentFile());
         if((currFileDateString==null)||(currFileDateString.length()<1))
            return 0;
         int currFileDate = Integer.parseInt(currFileDateString);

        // Ouvrir le repertoire
        File folder = new File(dbGab.getGabLogDir());
        File[] listOfFiles = folder.listFiles();

        if ((listOfFiles==null) || (listOfFiles.length==0))
        {
            log.error("Log directory ("+dbGab.getGabLogDir()+") unreachable or empty  for gab :"+dbGab.getGabCode());
            return 0;
        }
        int dateDeb=0;
        if (dbGab.getGabDateDebut()!=null)
        {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
            String dateDebStr =dateFormat.format(dbGab.getGabDateDebut());
            dateDeb=Integer.parseInt(dateDebStr);
        }

        // Boucle sur la liste des fichiers
        int found = 0;
        HashMap<Integer,String> files = new HashMap<Integer,String>();
        for (int i = 0; i < listOfFiles.length; i++)
        {
          if (listOfFiles[i].isFile())
          {
              if ((listOfFiles[i].getName().startsWith("EJ_")) && (listOfFiles[i].getName().endsWith("txt")))
               {
                  String fileDate = this.getDateFromFileName(listOfFiles[i].getName());
                  if((fileDate!=null)&&(fileDate.length()>0))
                  {
                      if (Integer.parseInt(fileDate)>dateDeb)
                      {
                          if (Integer.parseInt(fileDate)>currFileDate)
                          {
                              files.put(Integer.parseInt(fileDate), listOfFiles[i].getName());
                              found++;
                          }
                      }
                  }
              }
          }
        }

        return fillNextFilesArray(files);
    }

    private int fillNextFilesArray(HashMap<Integer,String> files)
    {
        if ((files == null) || (files.isEmpty()))
        {
            if (this.getCurrentFile().compareTo("EJDATA.LOG")==0)
            {
                return 0;
            }
            nextFiles = new String[1];
             nextFiles[0]="EJDATA.LOG";

            return 1;
        }
        nextFiles = new String[files.size()+1];

        HashMap<Integer,String> myfiles=files;

        int indice=0;

        while(!myfiles.isEmpty())
        {
            int min=30000000;
            Iterator it = myfiles.keySet().iterator();
            while(it.hasNext())
            {
                int curr = (Integer)it.next();
                if (curr<min)
                {
                    min=curr;
                }
            }

            nextFiles[indice]=myfiles.get(Integer.valueOf(min));
            indice ++;
            myfiles.remove(Integer.valueOf(min));
        }

        nextFiles[indice]="EJDATA.LOG";
        indice ++;


        return indice;
    }

    @Override
    protected void absentLogs(String oldCurrentFile,String newCurrentFile)
    {
        log.debug("NCRAbsentLogs Started: ");
        log.debug("oldCurrentFile:"+oldCurrentFile);
        log.debug("newCurrentFile:"+newCurrentFile);
        Date newDate = null;
        Date oldDate =null;
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

        try
        {
            if(oldCurrentFile.compareTo("EJDATA.LOG")==0)
            {
                BrsGabRefresh lastRef = (new GabRefreshManager()).getLast(dbGab.getGabId());
                if((lastRef==null)||(lastRef.getGarLastEvent()==null))
                {
                    //oldDate=tools.CommonUtil.getInsatance().newDate();
                    oldDate=dateFormat.parse(dateFormat.format(tools.CommonUtil.getInsatance().newDate()));
                }
                else
                {
                    oldDate=lastRef.getGarLastEvent();
                }
            }
            else if (oldCurrentFile.length()!=0)
            {
                oldDate=dateFormat.parse(this.getDateFromFileName(oldCurrentFile));
                oldDate= new Date(oldDate.getTime()-86400000);
            }
            else
            {
                 BrsGabRefresh lastRef = (new GabRefreshManager()).getLast(dbGab.getGabId());
                if((lastRef==null)||(lastRef.getGarLastEvent()==null))
                   oldDate=this.dbGab.getGabDateDebut();
                else
                    oldDate=lastRef.getGarLastEvent();
            }

            if(newCurrentFile.compareTo("EJDATA.LOG")==0)
            {
                //newDate=tools.CommonUtil.getInsatance().newDate();
                newDate=dateFormat.parse(dateFormat.format(tools.CommonUtil.getInsatance().newDate()));
            }
            else
            {
                newDate=dateFormat.parse(this.getDateFromFileName(newCurrentFile));
                newDate= new Date(newDate.getTime()-86400000);
            }

        } catch(Exception ex) {
        }

        if((oldDate==null)||(newDate==null))
            return;
        log.debug("oldDate:"+oldDate);
        log.debug("newDate:"+newDate);
        Date lostLogDate=new Date(oldDate.getTime()+86400000);
        while(lostLogDate.before(newDate))
        {
            log.error("Journal absent :"+dateFormat.format(lostLogDate));
            this.signalLostFiles(lostLogDate, LostfilesManager.ETAT_LOST_FILE);
            lostLogDate=new Date(lostLogDate.getTime()+86400000);
        }

    }
    
    public int processBlock(String line) {
    	int firstLine =this.getLastLine();

        if (
          line.contains("CASH WITHRAWAL")
       && line.contains("BALANCE INQUIRY")
       && line.contains("MINI RELEVE")
       && line.contains("AUTHENTIFICATION")
       && line.contains("CAPTURE DE CARTE")
       && line.contains("TRANSACTION ANNULEE"))
            {
            //log.error("processTraType:error");
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

         String newLine=line;
         String cashLine="";
         String lineToProcess="";
         String line2="";
         String line3="";
         String line4="";
         String line5="";
         String line6="";
    	
    	try {
            lastLine++;
            line2 = this.reader.readLine();if (line2==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            System.out.println("==>line2="+line2);
            line3 = this.reader.readLine();if (line3==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            System.out.println("==>line3="+line3);
            line4 = this.reader.readLine();if (line4==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            System.out.println("==>line4="+line4);            
        } catch (IOException ex) {
            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
            lastLine=firstLine;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
    	
        BrsTransaction tra = new BrsTransaction();
        //tra.setTraGabId(dbGab.getGabId());
        tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
        tra.setTraRetract(TransactionManager.RETRACT_NOK);
        tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
        tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
        tra.setTraNote1(0);
        tra.setTraNote2(0);
        tra.setTraNote3(0);
        tra.setTraNote4(0);
        
        newLine=line+" "+line2+" "+line3+" "+line4+" "+line5;
        
      
        ArrayList<BrsTransaction> traList = new ArrayList<BrsTransaction>();
        boolean cashProcessed=false;

        newLine=newLine.toUpperCase();
        // Type transaction
        int type=TransactionManager.TRANS_TYPE_INCONNU;
        if (newLine.contains("CASH WITHRAWAL")){
            type= TransactionManager.TRANS_TYPE_RETRAIT;
        }
        else if (newLine.contains("BALANCE INQUIRY")){
            type= TransactionManager.TRANS_TYPE_DEM_SOLDE;
        }
         else if (newLine.contains("MINI RELEVE")){
            type= TransactionManager.TRANS_TYPE_MIN_REL;
        }
        else if (newLine.contains("AUTHENTIFICATION")){
            type= TransactionManager.TRANS_TYPE_AUTHEN;
        }
        else if (newLine.contains("CAPTURE DE CARTE")){
            type= TransactionManager.TRANS_TYPE_CAP_CART;
        }
        else if (newLine.contains("TRANSACTION ANNULEE")){
            type= TransactionManager.TRANS_TYPE_ANNULLE;

        }
        else
        {
            log.error("Unknown transaction type===== ("+newLine+") at line :"+firstLine);
            lastLine=firstLine+1;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        tra.setTraType(type);
        if (type!=TransactionManager.TRANS_TYPE_RETRAIT)
            tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);

    	if(type==TransactionManager.TRANS_TYPE_AUTHEN) {
    		tra.setTraCardNbr(line2.trim());
    		
    		String[] lines=line3.split(" ");
    		String responseCode=lines[lines.length-1];
    		tra.setTraResponseCode(responseCode.replace(":", ""));
    	}
    	
    	if(type==TransactionManager.TRANS_TYPE_DEM_SOLDE) {
    		tra.setTraCardNbr(line2.trim());    		
    		String[] lines=line3.split("[\\s]+");    		
    		
    		String dateString=lines[0]+" "+lines[1];
    		DateFormat dateFormat = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
            Date evDate=null;
            try {
                evDate = dateFormat.parse(dateString);
                tra.setTraDate(evDate);
            } catch (ParseException ex) {
                log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                ex.printStackTrace();
            }   
            
            try {
                lastLine++;
                line5 = this.reader.readLine();if (line5==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                System.out.println("==>line5="+line5);                
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            tra.setTraAccountNbr(line5.replace("ACCOUNT :", ""));
    	}
    	
    	 if (type==TransactionManager.TRANS_TYPE_RETRAIT) {
    		 String[] lines=line2.split("[\\s]+");
    		 tra.setTraCardNbr(lines[3].replace(":", ""));    		
    		 lines=line3.split("[\\s]+");  
    		 String dateString=lines[0]+" "+lines[1];
     		 DateFormat dateFormat = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
             Date evDate=null;
             try {
                 evDate = dateFormat.parse(dateString);
                 tra.setTraDate(evDate);
             } catch (ParseException ex) {
                 log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                 ex.printStackTrace();
             }   
             tra.setTraRef(Integer.parseInt(lines[2]));
             lines=line4.split("[\\s]+");
             tra.setTraMontant(Float.valueOf(lines[1].replace(":", "")));    		
    		 
    		 try {
	            lastLine++;
	            line5 = this.reader.readLine();if (line5==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
	            System.out.println("==>line5="+line5);
	            line6 = this.reader.readLine();if (line6==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
	            System.out.println("==>line6="+line6);
	        } catch (IOException ex) {
	            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
	            lastLine=firstLine;
	            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
	        }
    		tra.setTraAccountNbr(line6.replace("ACCOUNT :", ""));
    		tra.setTraResponseCode(line5.replace("RESPONSE :", ""));
    		
    		String ligne=lastProcessedLine;
    		int pos=ligne.indexOf("NOTES PRESENTED");
    		if(pos<0) {
	    		String note=ligne.substring(pos);
	        	note=note.replace("NOTES PRESENTED:","");
	        	lines=note.split(",");
	    		
	    		tra.setTraNote1(Integer.parseInt(lines[0]));
	    		tra.setTraNote2(Integer.parseInt(lines[1]));
	    		tra.setTraNote3(Integer.parseInt(lines[2]));
	    		tra.setTraNote4(Integer.parseInt(lines[3]));
    		}
    		
    		String line7="",line8="";
    		try {
	            lastLine++;
	            line7 = this.reader.readLine();if (line7==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
	            System.out.println("==>line7="+line7);
	            line8 = this.reader.readLine();if (line8==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
	            System.out.println("==>line8="+line8);
	        } catch (IOException ex) {
	            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
	            lastLine=firstLine;
	            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
	        }
   
    		if(line8.contains("CASH TAKEN"))
    			tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
    		
    	 }
    	System.out.println("=====>Transaction:"+tra);
    	return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
    }

    @Override
    protected int processLine(String line)
    {
        System.out.println("processLine "+line);
    	if (line==null)
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;

        if (line.length()==0)
            return LogAnalyser.LOG_ANALYSER_REFRESH_OK;

        String newLine = line.toUpperCase();
        // Traitement selon le cas
        
        if(newLine.contains("PIN ENTERED"))
        	return processTraComplete2(line);
        if(newLine.contains("*TRANSACTION START"))
            return processTraComplete(newLine);

//"CASH RETRACTED""PRESENTER ERROR""PRESENTER ERROR""NOTES PRESENTED""CARD RETAINED BY HOST"NOTES TAKEN
        if(newLine.contains("NOTES STACKED")||newLine.contains("CARD TAKEN"))
        {
            //log.error("debut processTraType");
            return processTraMotCles(newLine);
        }            
        //if (newLine.contains("RETRAIT""DEMANDE DE SOLDE""MINI RELEVE""AUTHENTICATION""CAPTURE DE CARTE""TRANSACTION ANNULEE")){

        if (
          newLine.contains("CASH WITHRAWAL")
        ||newLine.contains("BALANCE INQUIRY")
        ||newLine.contains("MINI RELEVE")
        ||newLine.contains("AUTHENTIFICATION")
        ||newLine.contains("CAPTURE DE CARTE")
        ||newLine.contains("TRANSACTION ANNULEE"))
        {           
           return processTraType(newLine);
        }

        if(newLine.contains("CUTOFF"))
            return processCuttOff(newLine);

        if(newLine.contains("TYPE1-10000")) //SUPERVISOR MODE ENTRY
            return processSupMode(newLine);

        if(newLine.contains("POWER INTERRUPTION DURING"))
            return processPowerInterupt(newLine);

        if ((newLine.contains("CASSETTE REMOVED"))
            || (newLine.contains("REJECT BIN REMOVED"))
            || (newLine.contains("REJECT BIN INSERTED"))
            || (newLine.contains("CASSETTE INSERTED"))){

             return processSafeDoor(newLine);
        }
        
        lastProcessedLine=line;

        // Reste ignore
        return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
    }

    private int processSafeDoor(String line) {

    	System.out.println("processSafeDoor "+line);
        int firstLine = this.getLastLine();
        
        if((!line.contains("CASSETTE REMOVED"))
            && (!line.contains("REJECT BIN REMOVED"))
            && (!line.contains("REJECT BIN INSERTED"))
            && (!line.contains("CASSETTE INSERTED")))
        {
            log.error("processSafeDoor do not contain key word at line :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }

        // Calculate Event Date
        Date coeDate=null;
        if((lineBefore!=null)&&(lineBefore.length()>1))
            coeDate=getDateFromLine(lineBefore,true);

        if((coeDate==null)&&(lastEventDate!=null))
        {
             coeDate=new Date(lastEventDate.getTime()+1000);
        }

        SimpleDateFormat formatJour = new SimpleDateFormat("yyyyMMdd");
        if(coeDate==null)
        {
            String fileDateS = this.getDateFromFileName(this.getCurrentFile());
            if((fileDateS!=null)&&(fileDateS.length()>0))
            {
                try {
                    coeDate = formatJour.parse(fileDateS);
                    coeDate= new Date(coeDate.getTime()-86400000);
                } catch (ParseException ex) {
                    log.error("Exception while parsing date :"+fileDateS);
                    ex.printStackTrace();
                }
            }
        }

        if(coeDate==null)
        {
            log.error("processSafeDoor Unable to calculate coeDate :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
       // this.lastEventDate= coeDate;


        // Event type
        int evtType=CoffreManager.EVENT_INCONNU;
        if(line.contains("REMOVED"))
            evtType=CoffreManager.EVENT_OUVERT;
        else if(line.contains("INSERTED"))
            evtType=CoffreManager.EVENT_FERME;

        if(evtType==CoffreManager.EVENT_INCONNU)
        {
            log.error("processSafeDoor Unable to define event type :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }

        // Recuperer le dernier evennement
        BrsCoffreEvent lastEvent = CoffreManager.getLastEvent(this.dbGab.getGabId());
        if(lastEvent!=null)
        {
            Date lastCoeDate = lastEvent.getCoeDate();
            String coeJour=formatJour.format(coeDate);
            String lastCoeJour =formatJour.format(lastCoeDate);
            if(lastCoeJour.compareTo(coeJour)==0)
            {            
                // Verifier si il n y a pas de transactions
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String where = " where traGabId="+this.dbGab.getGabId()+ " and traInsDate>'"+dateFormat.format(lastCoeDate)+"'";
                ArrayList<BrsTransaction> trans= TransactionManager.filterTransactions(where, "", 0, 1);
                if((trans==null)||(trans.isEmpty()))
                    return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
        }

        // Inserer l'evennement
         BrsCoffreEvent event=new BrsCoffreEvent(dbGab.getGabId(), coeDate, CoffreManager.EVENT_OUVERT,0,CoffreManager.NOTIF_NOT_NEEDED);
        if (CoffreManager.isCoeNotifNedded(event))
            event.setCoeNotif(CoffreManager.NOTIF_NEEDED);
        
         /*-------------- Debut Bug 662 ------------------*/
        if(lastEvent!=null)
        {
            if(!event.getCoeDate().after(lastEvent.getCoeDate()))
            {
                event.setCoeDate(new Date(lastEvent.getCoeDate().getTime()+1000));
            }
        }       
        /*--------------  Fin  Bug 662 ------------------*/
        
        CoffreManager.insert(event);
        System.out.println("CoffreManager.insert==================>"+event);
        this.lastEventDate= coeDate;

        return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
     }

    @Override
    protected  boolean containsKeyWord(String line)
    {
    	System.out.println("containsKeyWord "+line);
    	if (line==null)
            return false;

        if (line.length()==0)
            return false;

        String newLine = line.toUpperCase();
        // Traitement selon le cas

        if(newLine.contains("*TRANSACTION START"))
            return true;

        if(newLine.contains("CUTOFF"))
            return true;

        if(line.contains("SUPERVISOR MODE ENTRY"))
            return true;

        if(line.contains("POWER INTERRUPTION DURING"))
            return true;

        return false;
    }

    private Date getDateForLine(String heures)
    {
    	System.out.println("getDateForLine "+heures);
    	DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
        String fileDate= this.getDateFromFileName(this.getCurrentFile());
        if((fileDate==null)||(fileDate.length()<1))
        {
            return null;
        }
        String dateString = fileDate+" "+heures;
        Date evDate=null;

        try {
            evDate = dateFormat.parse(dateString);
            evDate=new Date(evDate.getTime()-86400000);
        } catch (ParseException ex) {
            log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine);
            ex.printStackTrace();
            return null;
        }

        return evDate;
    }

    private Date getDateFromLine(String line,boolean year4Digit)
    {
    	System.out.println("getDateFromLine "+line);
    	// La date
        if((line==null)&&(line.length()<1))
                 return null;

        // La date        
        Date evDate=null;

        String strDate="";
        String ligne=line.replace("*", " ");
        String[] lignes=ligne.split("[\\s]+");
        
        SimpleDateFormat dateTimesFormat=new SimpleDateFormat("HH:mm:ss");

         try {
            evDate = dateTimesFormat.parse(lignes[0]);
        } catch (ParseException ex) {
            log.error("Error in date"+strDate+" ex:"+ex.getMessage());
            ex.printStackTrace();
        }
    
        return evDate;
    }

    private String getDateFormat(String inDate)
    {
    	System.out.println("getDateFormat "+inDate);
    	String format1="dd/MM/yyyy HH:mm";
        String format2="MM/dd/yyyy HH:mm";
        SimpleDateFormat f1=new SimpleDateFormat(format1);
        SimpleDateFormat f2=new SimpleDateFormat(format2);
        SimpleDateFormat f3=new SimpleDateFormat("yyyyMMdd");

        if (inDate.length()<16)
            return format1;
        
        int mois =Integer.parseInt(inDate.substring(3,5));
        if (mois>12)
        {
            return format2;
        }

        if (this.lastEventDate!=null)
        {
            try {
                long delta1 = f1.parse(inDate).getTime()-lastEventDate.getTime();
                long delta2 = f2.parse(inDate).getTime()-lastEventDate.getTime();
                if(Math.abs(delta2)<Math.abs(delta1)) return format2;
                else                                  return format1;

            } catch (ParseException ex) {
                log.debug("Exception raised during parse date !!!"+ex.getMessage());
            }
        }
        
        try {
            String dateFromFileName = this.getDateFromFileName(this.getCurrentFile());
            long delta1 = f1.parse(inDate).getTime()-(f3.parse(dateFromFileName).getTime()-86400000);
            long delta2 = f2.parse(inDate).getTime()-(f3.parse(dateFromFileName).getTime()-86400000);
            if(Math.abs(delta2)<Math.abs(delta1)) return format2;
            else                                  return format1;
        } catch (Exception ex) {
            log.debug("Exception raised during parse date !!!"+ex.getMessage());
        }
        return format1;
    }

    private int processTraComplete(String line){

    	System.out.println("processTraComplete "+line);
    	
        int firstLine = this.getLastLine();
        if(!line.contains("*TRANSACTION START"))
        {
            log.error("Transaction line do not contain '*TRANSACTION START' at line :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        // Retrouver la date sur la line before
        Date startDate = this.getDateFromLine(lineBefore,true);
        if(lastEventDate!=null)
         {
             if((startDate==null)||(lastEventDate.after(startDate)))
             {
                 startDate=new Date(lastEventDate.getTime()+1000);
                 lastEventDate=startDate;
             }
         }

        BrsTransaction tra = new BrsTransaction();
        ArrayList<BrsTransaction> traList = new ArrayList<BrsTransaction>();
        boolean cashProcessed=false;

        // Gab
        //tra.setTraGabId(dbGab.getGabId());
        tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
        tra.setTraRetract(TransactionManager.RETRACT_NOK);
        tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
        tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
        tra.setTraNote1(0);
        tra.setTraNote2(0);
        tra.setTraNote3(0);
        tra.setTraNote4(0);

        String newLine="";
        String cashLine="";
        String lineToProcess="";

        while(!newLine.contains("TRANSACTION END"))
        {
            try {
                lastLine++;
                newLine = this.reader.readLine();
		if (newLine==null)
                {
                    if(isForceEnd())
                    {
                        newLine="<- TRANSACTION END";
                        break;
                    }
                    else
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
                    }
                }
            }
            catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            newLine=newLine.toUpperCase();
            if (newLine.contains("NOTES TAKEN")){
                if (tra.getTraRetract()==TransactionManager.RETRACT_NOK)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
            }
            else if (newLine.contains("CASH RETRACTED")){
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }

            }
            else if ((newLine.contains("BILL/S RETRACTED"))||(newLine.contains("PRESENTER ERROR")))
            {
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }
            }
            else if(newLine.contains("NOTES PRESENTED"))
            {
                this.updateCashPresented(newLine, startDate);
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    processCashPresented(newLine,tra,startDate);
                    cashProcessed=true;
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(newLine,traList.get(indice),startDate);
                        cashProcessed=true;
                    }
                    else
                        cashLine=newLine;
                }
                else
                    cashLine=newLine;
            }
            else if ((newLine.contains("CARD RETAINED BY HOST"))||(newLine.contains("CARD CAPTURED")))
            {
                if ((tra!=null)&&(tra.getTraResponseCode()!=null)&&(tra.getTraResponseCode().length()>0))
                {
                    tra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    BrsTransaction lastTra =traList.get(indice);
                    lastTra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
            }
            else if(newLine.contains("========================================"))
            {
                // Passer a la ligne suivante
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Type transaction
                int type=TransactionManager.TRANS_TYPE_INCONNU;
                if (newLine.contains("CASH WITHRAWAL")){
                    type= TransactionManager.TRANS_TYPE_RETRAIT;
                    if (cashLine.length()!=0)
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                else if (newLine.contains("BALANCE INQUIRY")){
                    type= TransactionManager.TRANS_TYPE_DEM_SOLDE;
                }
                 else if (newLine.contains("MINI RELEVE")){
                    type= TransactionManager.TRANS_TYPE_MIN_REL;
                }
                else if (newLine.contains("AUTHENTIFICATION")){
                    type= TransactionManager.TRANS_TYPE_AUTHEN;
                }
                else if (newLine.contains("CAPTURE DE CARTE")){
                    type= TransactionManager.TRANS_TYPE_CAP_CART;
                }
                else if (newLine.contains("TRANSACTION ANNULEE")){
                    type= TransactionManager.TRANS_TYPE_ANNULLE;

                }
                else
                {
                    log.error("Unknown transaction type ("+newLine+") at line :"+firstLine);
                    lastLine=firstLine+1;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                tra.setTraType(type);
                if (type!=TransactionManager.TRANS_TYPE_RETRAIT)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);

                // sauter 2 lignes
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Date
                String[] date = newLine.split("[\\s]+");
                if ((date==null)||(date.length<4)||(date[0].length()!=8))
                {
                    System.out.println("newLine3="+newLine);
                	log.error("Transaction not well formatted at line :"+firstLine);
                    lastLine=firstLine+1;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                else
                {
                    String dateString = date[0].substring(date[0].length()-8,date[0].length())+" "+date[1];
                    /*
                    DateFormat dateFormat = new SimpleDateFormat("dd/MM/yy HH:mm:ss");
                    Date evDate=null;
                    try {
                        evDate = dateFormat.parse(dateString);
                    } catch (ParseException ex) {
                        log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                        ex.printStackTrace();
                    }
                     * */
                    Date evDate=this.buildTraDate(dateString);
                    if (evDate == null)
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;
                    }
                    tra.setTraDate(evDate);

                    // Reference
                    try{
                        tra.setTraRef(Integer.parseInt(date[2]));
                    } catch(Exception ex){
                        tra.setTraRef(111111);
                        log.error("Exception occured with bad NUM.OP :"+date[2]);
                    }
                }

                // Verifier le numero du terminal
                if((!this.gabNumChecked)&&(date!=null)&&(date.length>3)&&(date[3].trim().length()>0))
                    this.checkGabNum(date[3]);


                // Ligne :NUM.CARTES     : 4047622000049609
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -1;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return -2;
                }
                int pos=-1;
                if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                    pos=newLine.indexOf("CARD NBR.      :");
                else
                    pos=newLine.indexOf("NUM.CARTES     :");
                if (pos == -1)
                    pos = 0;

                String card="";
                String compte="";

                String cardNum=newLine.substring(16+pos).trim();
                if(cardNum.contains("UM.COMPTE     :"))
                {
                    log.info("cardNum: "+cardNum);
                    int pos1=cardNum.indexOf("UM.COMPTE     :");
                    card=cardNum.substring(0,pos1).trim();
                    compte=cardNum.substring(pos1+15).trim();
                }
                else
                {
                    card=cardNum.trim();
                    // Ligne :NUM.COMPTE     : --------------------
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -2;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        ex.printStackTrace();
                        return -1;
                    }
                    if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                        pos=newLine.indexOf("ACCOUNT NBR.   :");
                    else
                        pos=newLine.indexOf("NUM.COMPTE     :");

                    if (pos == -1)
                        pos = 0;
                    compte=newLine.substring(16+pos).trim();
                }
                tra.setTraCardNbr(card.trim());
                if ((compte.trim()!=null) && (!compte.trim().startsWith("----")))
                    tra.setTraAccountNbr("XXXXXXXXXXXXXXXXXXXX");
                else
                    tra.setTraAccountNbr(compte.trim());
                
                // Ligne : MNT.RETRAIT     : MAD 1000.00
                boolean mntLineExiste=true;
                if((type==TransactionManager.TRANS_TYPE_RETRAIT)||(type==TransactionManager.TRANS_TYPE_ANNULLE))
                {
                     try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }

                     if ((!newLine.contains("MNT.TRANSACT   :")) && (!newLine.contains("MNT.RETRAIT    :")))
                     {
                         mntLineExiste=false;
                     }
                     else
                     {
                        if (type==TransactionManager.TRANS_TYPE_RETRAIT)
                            pos=newLine.indexOf("MNT.RETRAIT    :");
                        else if (type==TransactionManager.TRANS_TYPE_ANNULLE)
                             pos=newLine.indexOf("MNT.TRANSACT   :");

                        if (pos == -1)
                            pos = 0;

                        String mnt = newLine.substring(21+pos).trim();
                        Float mntFloat=new Float(0);
                        if ((mnt!=null)&&(mnt.length()!=0))
                            mntFloat = Float.parseFloat(mnt);
                        tra.setTraMontant(mntFloat);
                     }
                }

                //  Ligne : CODE REPONSE   : 000
                if (mntLineExiste)
                {
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }

                }
                if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                    pos=newLine.indexOf("RESPONSE CODE  :");
                else
                    pos=newLine.indexOf("CODE REPONSE   :");

                if (pos == -1)
                    pos = 0;
                tra.setTraResponseCode(newLine.substring(16+pos,20+pos).trim());
                if (tra.getTraResponseCode().compareTo("000")!=0)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                if ((tra.getTraType()!=TransactionManager.TRANS_TYPE_CAP_CART)&&(this.isCardPickedUp(tra.getTraResponseCode())))
                {
                    tra.setTraType(TransactionManager.TRANS_TYPE_CAP_CART);
                }

                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("9 Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Sauver la transaction en cours et initailiser une nouvelle
                if ((tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
                {
                    if ((cashLine.length()!=0) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                    traList.add(tra);

                    tra = new BrsTransaction();
                    //tra.setTraGabId(dbGab.getGabId());
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
                    tra.setTraRetract(TransactionManager.RETRACT_NOK);
                    tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
                    tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
                    tra.setTraNote1(0);
                    tra.setTraNote2(0);
                    tra.setTraNote3(0);
                    tra.setTraNote4(0);
                }
            }
            else if (containsKeyWord(newLine))
            {
                lineToProcess=newLine;
                newLine="TRANSACTION END";
            }          
        }

        if (newLine.contains("TRANSACTION END"))
        {
            if ((tra!=null) && (tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
            {
                if (cashLine.length()!=0)
                {
                    if (
                        ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    &&   ((tra.getTraResponseCode()==null)||(tra.getTraResponseCode().compareTo("000")==0))
                    )
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                traList.add(tra);
            }

            // Enregistrer
            Iterator it = traList.iterator();
            while(it.hasNext())
            {               
                BrsTransaction tra1 = (BrsTransaction)it.next();

                if((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&(tra1.getTraResponseCode().compareTo("000")==0)&&(!cashProcessed))
                    estimateNotesPresented(tra1,startDate);

                if(startDate==null)
                    startDate=tra1.getTraDate();
                tra1.setTraInsDate(startDate);

               // if(tra1.getTraRef().intValue()==143342)
                //    System.exit(1);

                TransactionManager.setTraNotifRet4Tra(tra1);
                
                TransactionManager.insert(tra1);
                System.out.println("TransactionManager.insert==================>"+tra1);

                if ((lastEventDate==null) || (tra1.getTraInsDate().after(lastEventDate)))
                {
                    lastEventDate=tra1.getTraInsDate();
                }
                /*if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraDate();    */
                if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraInsDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraInsDate();
            }

            if (lineToProcess.length()>0)
                return processLine(lineToProcess);

                  if(isForceEnd())
            {
                return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
            }

            return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
        }
        //log.error("'TRANSACTION END' not found at line :"+firstLine);
        lastLine=firstLine+1;
        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
    }

    private void estimateNotesPresented(BrsTransaction tra,Date startDate){
        //log.error("debut estimateNotesPresented" );

        if((tra==null)||(tra.getTraType()!=TransactionManager.TRANS_TYPE_RETRAIT)||(tra.getTraMontant()<0))
            return;

        String cashLine="13:36:05 NOTES PRESENTED 1,0,0,0";
        SimpleDateFormat df= new SimpleDateFormat("HH:mm:ss");
        if(startDate!=null)
            cashLine=df.format(startDate);
        else if(tra.getTraInsDate()!=null)
            cashLine=df.format(tra.getTraInsDate());
        else if(this.lastEventDate!=null)
            cashLine=df.format(this.lastEventDate);
        else
            return;

        cashLine+=" NOTES PRESENTED ";

        if(tra.getTraMontant().intValue()==100){
            cashLine+="1,0,0,0";
            //log.error("cashLine: "+cashLine);
            this.updateCashPresented(cashLine, startDate);
            processCashPresented(cashLine,tra,startDate);
            return;
        }

        int cas1=tra.getTraMontant().intValue()/100;
        int cas2=0;

        // Delta actuel des cassettes
        ArrayList<BrsCassette> listCass= CassetteManager.listCassGab(dbGab.getGabId());
        if((listCass==null)||(listCass.isEmpty()))
                return;

       
        int curCas1=0;
        int curCas2=0;

        Iterator it=listCass.iterator();
        while(it.hasNext())
        {
            BrsCassette cas=(BrsCassette)it.next();
            if(cas.getCasOrder()==1)
                curCas1=cas.getCasNotes();
            else if(cas.getCasOrder()==2)
                curCas2=cas.getCasNotes();
        }
         int deltaCas=curCas1-curCas2;

        // Nombre des combinaison possibles
        int nbrComb=cas1/2+1;
        int[] combinaisons = new int[nbrComb];
        int index=0;

        combinaisons[index]=cas1;
        index+=1;
        while(index<nbrComb){
            combinaisons[index]=combinaisons[index]-3;
            index+=1;
        }

        int max=0;
        for(int i=0;i<nbrComb;i++){
            if(Math.abs(combinaisons[i]-deltaCas)>max)
                max=Math.abs(combinaisons[i]-deltaCas);
        }

        boolean trouve=false;
        int minIndex=1000;
        int occur=0;
        while((!trouve)&&(occur<nbrComb)){
            int min=1000;
            minIndex=1000;
            for(int i=0;i<nbrComb;i++){
                if(Math.abs(combinaisons[i]-deltaCas)<min)
                    min=Math.abs(combinaisons[i]-deltaCas);
                    minIndex=i;
            }
            if(minIndex<nbrComb){
                if((minIndex<curCas2)&&((cas1-2*minIndex)<curCas1))
                {
                    trouve=true;
                    break;
                }
                else{
                    combinaisons[minIndex]=max;
                }
            }
            occur+=1;
        }


        if((!trouve)||(index>nbrComb))
           return;
        
        cashLine+=Integer.toString(cas1-2*minIndex)+","+Integer.toString(minIndex)+",0,0";
        //log.error("cashLine: "+cashLine);

        this.updateCashPresented(cashLine, startDate);
        processCashPresented(cashLine,tra,startDate);
        return;
    }

    private int processTraMotCles(String line){

    	System.out.println("processTraMotCles "+line);
    	
    	int firstLine = this.getLastLine();

        if(line.contains("PIN ENTERED")
        && line.contains("NOTES STACKED")
        && line.contains("CARD TAKEN"))
        {
            
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }

        //Date startDate = this.getDateFromLine(line,true);

        Date startDate =null;
        
        String[] champs = line.split("[\\s]");
        String heueres="";
        if((champs!=null)&&(champs.length>1))
        {            
            if((champs[1].compareTo("PIN")==0)||((champs[1].compareTo("NOTES")==0))||((champs[1].compareTo("CARD")==0)))
            {
                heueres=champs[0].trim();
            }
            else if((champs.length>2)&&((champs[2].compareTo("PIN")==0)||((champs[2].compareTo("NOTES")==0))||((champs[2].compareTo("CARD")==0))))
            {
                heueres=champs[1].trim();
            }
            else if((champs.length>3)&&((champs[3].compareTo("PIN")==0)||((champs[3].compareTo("NOTES")==0))||((champs[3].compareTo("CARD")==0))))
            {
                heueres=champs[2].trim();
            }
            else if((champs.length>4)&&((champs[4].compareTo("PIN")==0)||((champs[4].compareTo("NOTES")==0))||((champs[4].compareTo("CARD")==0))))
            {
                heueres=champs[3].trim();
            }
        }
        if(heueres.length()>0)
        {
            startDate=this.getDateForLine(heueres);
        }
        
        if(lastEventDate!=null)
         {
             if((startDate==null)||(lastEventDate.after(startDate)))
             {
                 startDate=new Date(lastEventDate.getTime()+1000);
                 lastEventDate=startDate;
             }
         }

        BrsTransaction tra = new BrsTransaction();
        ArrayList<BrsTransaction> traList = new ArrayList<BrsTransaction>();
        boolean cashProcessed=false;

        // Gab
        //tra.setTraGabId(dbGab.getGabId());
        tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
        tra.setTraRetract(TransactionManager.RETRACT_NOK);
        tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
        tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
        tra.setTraNote1(0);
        tra.setTraNote2(0);
        tra.setTraNote3(0);
        tra.setTraNote4(0);

        String newLine=line;
        String cashLine="";
        String lineToProcess="";

        while(!newLine.contains("TRANSACTION END"))
        {
            if (newLine.contains("NOTES TAKEN")){
                if (tra.getTraRetract()==TransactionManager.RETRACT_NOK)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
            }
            else if (newLine.contains("CASH RETRACTED")){
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }

            }
            else if ((newLine.contains("BILL/S RETRACTED"))||(newLine.contains("PRESENTER ERROR")))
            {
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }
            }
            else if(newLine.contains("NOTES PRESENTED"))
            {
                this.updateCashPresented(newLine, startDate);
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    //log.error("newLine: "+newLine);
                    processCashPresented(newLine,tra,startDate);
                    cashProcessed=true;
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(newLine,traList.get(indice),startDate);
                        cashProcessed=true;
                    }
                    else
                        cashLine=newLine;
                }
                else
                    cashLine=newLine;
            }
            else if ((newLine.contains("CARD RETAINED BY HOST"))||(newLine.contains("CARD CAPTURED")))
            {
                if ((tra!=null)&&(tra.getTraResponseCode()!=null)&&(tra.getTraResponseCode().length()>0))
                {
                    tra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    BrsTransaction lastTra =traList.get(indice);
                    lastTra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
            }

            else if(newLine.contains("-------------------------"))
            {
                // Passer a la ligne suivante
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                
                tra.setTraCardNbr(newLine.trim());
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Type transaction
                int type=TransactionManager.TRANS_TYPE_INCONNU;
                if (newLine.contains("CASH WITHRAWAL")){
                    type= TransactionManager.TRANS_TYPE_RETRAIT;
                    if (cashLine.length()!=0)
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                else if (newLine.contains("BALANCE INQUIRY")){
                    type= TransactionManager.TRANS_TYPE_DEM_SOLDE;
                }
                 else if (newLine.contains("MINI RELEVE")){
                    type= TransactionManager.TRANS_TYPE_MIN_REL;
                }
                else if (newLine.contains("AUTHENTIFICATION")){
                    type= TransactionManager.TRANS_TYPE_AUTHEN;
                }
                else if (newLine.contains("CAPTURE DE CARTE")){
                    type= TransactionManager.TRANS_TYPE_CAP_CART;
                }
                else if (newLine.contains("TRANSACTION ANNULEE")){
                    type= TransactionManager.TRANS_TYPE_ANNULLE;

                }
                else
                {
                    log.error("Unknown transaction type ("+newLine+") at line :"+firstLine);
                    lastLine=firstLine+1;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                tra.setTraType(type);
                if (type!=TransactionManager.TRANS_TYPE_RETRAIT)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);

                if (type==TransactionManager.TRANS_TYPE_AUTHEN) {
                	return 0;
                }
                
                // sauter 2 lignes
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                /*
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }*/

                // Date
                String[] date = newLine.split("[\\s]+");
                if ((date==null)||(date.length<4)||(date[0].length()!=8))
                {
                    System.out.println("newLine4="+newLine);
                	log.error("Transaction not well formatted at line :"+firstLine);
                    lastLine=firstLine+1;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                else
                {
                    String dateString = date[0].substring(date[0].length()-8,date[0].length())+" "+date[1];
                    /*
                    DateFormat dateFormat = new SimpleDateFormat("dd/MM/yy HH:mm:ss");
                    Date evDate=null;
                    try {
                        evDate = dateFormat.parse(dateString);
                    } catch (ParseException ex) {
                        log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                        ex.printStackTrace();
                    }
                     * */
                    Date evDate=this.buildTraDate(dateString);
                    if (evDate == null)
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;
                    }
                    tra.setTraDate(evDate);

                    // Reference
                    try{
                        tra.setTraRef(Integer.parseInt(date[2]));
                    } catch(Exception ex){
                        tra.setTraRef(111111);
                        log.error("Exception occured with bad NUM.OP :"+date[2]);
                    }
                }

                // Verifier le numero du terminal
                if((!this.gabNumChecked)&&(date!=null)&&(date.length>3)&&(date[3].trim().length()>0))
                    this.checkGabNum(date[3]);


                // Ligne :NUM.CARTES     : 4047622000049609
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -1;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return -2;
                }
                int pos=-1;
                if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                    pos=newLine.indexOf("CARD NBR.      :");
                else
                    pos=newLine.indexOf("NUM.CARTES     :");
                if (pos == -1)
                    pos = 0;

                String card="";
                String compte="";

                String cardNum=newLine.substring(16+pos).trim();
                if(cardNum.contains("UM.COMPTE     :"))
                {
                    log.info("cardNum: "+cardNum);
                    int pos1=cardNum.indexOf("UM.COMPTE     :");
                    card=cardNum.substring(0,pos1).trim();
                    compte=cardNum.substring(pos1+15).trim();
                }
                else
                {
                    card=cardNum.trim();
                    // Ligne :NUM.COMPTE     : --------------------
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -2;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        ex.printStackTrace();
                        return -1;
                    }
                    if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                        pos=newLine.indexOf("ACCOUNT NBR.   :");
                    else
                        pos=newLine.indexOf("NUM.COMPTE     :");

                    if (pos == -1)
                        pos = 0;
                    compte=newLine.substring(16+pos).trim();
                }
                tra.setTraCardNbr(card.trim());
                if ((compte.trim()!=null) && (!compte.trim().startsWith("----")))
                    tra.setTraAccountNbr("XXXXXXXXXXXXXXXXXXXX");
                else
                    tra.setTraAccountNbr(compte.trim());
                
                // Ligne : MNT.RETRAIT     : MAD 1000.00
                boolean mntLineExiste=true;
                if((type==TransactionManager.TRANS_TYPE_RETRAIT)||(type==TransactionManager.TRANS_TYPE_ANNULLE))
                {
                     try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }

                     if ((!newLine.contains("MNT.TRANSACT   :")) && (!newLine.contains("MNT.RETRAIT    :")))
                     {
                         mntLineExiste=false;
                     }
                     else
                     {
                        if (type==TransactionManager.TRANS_TYPE_RETRAIT)
                            pos=newLine.indexOf("MNT.RETRAIT    :");
                        else if (type==TransactionManager.TRANS_TYPE_ANNULLE)
                             pos=newLine.indexOf("MNT.TRANSACT   :");

                        if (pos == -1)
                            pos = 0;

                        String mnt = newLine.substring(21+pos).trim();
                        Float mntFloat=new Float(0);
                        if ((mnt!=null)&&(mnt.length()!=0))
                            mntFloat = Float.parseFloat(mnt);
                        tra.setTraMontant(mntFloat);
                     }
                }

                //  Ligne : CODE REPONSE   : 000
                if (mntLineExiste)
                {
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }

                }
                if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                    pos=newLine.indexOf("RESPONSE CODE  :");
                else
                    pos=newLine.indexOf("CODE REPONSE   :");

                if (pos == -1)
                    pos = 0;
                tra.setTraResponseCode(newLine.substring(16+pos,20+pos).trim());
                if (tra.getTraResponseCode().compareTo("000")!=0)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                if ((tra.getTraType()!=TransactionManager.TRANS_TYPE_CAP_CART)&&(this.isCardPickedUp(tra.getTraResponseCode())))
                {
                    tra.setTraType(TransactionManager.TRANS_TYPE_CAP_CART);
                }

                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("9 Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Sauver la transaction en cours et initailiser une nouvelle
                if ((tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
                {
                    if ((cashLine.length()!=0) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                    traList.add(tra);

                    tra = new BrsTransaction();
                    //tra.setTraGabId(dbGab.getGabId());
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
                    tra.setTraRetract(TransactionManager.RETRACT_NOK);
                    tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
                    tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
                    tra.setTraNote1(0);
                    tra.setTraNote2(0);
                    tra.setTraNote3(0);
                    tra.setTraNote4(0);
                }
            }

            else if (containsKeyWord(newLine))
            {
                lineToProcess=newLine;
                newLine="TRANSACTION END";
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();
				if (newLine==null)
                {
                    if(isForceEnd())
                    {
                        newLine="<- TRANSACTION END";
                        break;
                    }
                    else
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
                    }
                }
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
        }

        if (newLine.contains("TRANSACTION END"))
        {
            if ((tra!=null) && (tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
            {
                if (cashLine.length()!=0)
                {
                    if (
                        ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    &&   ((tra.getTraResponseCode()==null)||(tra.getTraResponseCode().compareTo("000")==0))
                    )
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                traList.add(tra);
            }

            // Enregistrer
            Iterator it = traList.iterator();
            while(it.hasNext())
            {
                BrsTransaction tra1 = (BrsTransaction)it.next();

                if(startDate==null)
                    startDate=tra1.getTraDate();
                tra1.setTraInsDate(startDate);

                TransactionManager.setTraNotifRet4Tra(tra1);
                
                TransactionManager.insert(tra1);
                System.out.println("TransactionManager.insert==================>"+tra1);
                
                if ((lastEventDate==null) || (tra1.getTraInsDate().after(lastEventDate)))
                {
                    lastEventDate=tra1.getTraInsDate();
                }
                 /*if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraDate();    */
                if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraInsDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraInsDate();
                if((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&(tra1.getTraResponseCode().compareTo("000")==0)&&(!cashProcessed))
                    estimateNotesPresented(tra1,startDate);

            }

            if (lineToProcess.length()>0)
                return processLine(lineToProcess);

            if(isForceEnd())
            {
                return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
            }
			
            return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
        }
        log.error("'TRANSACTION END' not found at line :"+firstLine);
        lastLine=firstLine+1;
        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
    }

     private int processTraType(String line){
    	 System.out.println("processTraType "+line);
    	 
    	 int firstLine =this.getLastLine();

        if (
          line.contains("CASH WITHRAWAL")
       && line.contains("BALANCE INQUIRY")
       && line.contains("MINI RELEVE")
       && line.contains("AUTHENTIFICATION")
       && line.contains("CAPTURE DE CARTE")
       && line.contains("TRANSACTION ANNULEE"))
            {
            //log.error("processTraType:error");
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

         String newLine=line;
         String cashLine="";
         String lineToProcess="";
         
         SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
         Date startDate=null;
        try {
            startDate = format.parse(this.getDateFromFileName(this.getCurrentFile()) + " 00:00:00");
            startDate = new Date(startDate.getTime()-86400000);
        } catch (Exception ex) {
            log.error("Incorrect date format :"+startDate+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
           ex.printStackTrace();
        }

         if(lastEventDate!=null)
         {
             if((startDate==null)||(lastEventDate.after(startDate)))
             {
                 startDate=new Date(lastEventDate.getTime()+1000);
                 lastEventDate=startDate;
             }
         }
         
        BrsTransaction tra = new BrsTransaction();
        //tra.setTraGabId(dbGab.getGabId());
        tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
        tra.setTraRetract(TransactionManager.RETRACT_NOK);
        tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
        tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
        tra.setTraNote1(0);
        tra.setTraNote2(0);
        tra.setTraNote3(0);
        tra.setTraNote4(0);

         ArrayList<BrsTransaction> traList = new ArrayList<BrsTransaction>();
         boolean cashProcessed=false;

        newLine=newLine.toUpperCase();
        // Type transaction
        int type=TransactionManager.TRANS_TYPE_INCONNU;
        if (newLine.contains("CASH WITHRAWAL")){
            type= TransactionManager.TRANS_TYPE_RETRAIT;
        }
        else if (newLine.contains("BALANCE INQUIRY")){
            type= TransactionManager.TRANS_TYPE_DEM_SOLDE;
        }
         else if (newLine.contains("MINI RELEVE")){
            type= TransactionManager.TRANS_TYPE_MIN_REL;
        }
        else if (newLine.contains("AUTHENTIFICATION")){
            type= TransactionManager.TRANS_TYPE_AUTHEN;
        }
        else if (newLine.contains("CAPTURE DE CARTE")){
            type= TransactionManager.TRANS_TYPE_CAP_CART;
        }
        else if (newLine.contains("TRANSACTION ANNULEE")){
            type= TransactionManager.TRANS_TYPE_ANNULLE;

        }
        else
        {
            log.error("Unknown transaction type===== ("+newLine+") at line :"+firstLine);
            lastLine=firstLine+1;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        tra.setTraType(type);
        if (type!=TransactionManager.TRANS_TYPE_RETRAIT)
            tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);

        // sauter 2 lignes
        try {
            lastLine++;
            newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            System.out.println("==>newLine="+newLine);
        } catch (IOException ex) {
            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
            lastLine=firstLine;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        try {
            lastLine++;
            newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            System.out.println("===>newLine="+newLine);
        } catch (IOException ex) {
            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
            lastLine=firstLine;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }

        // Date
        String[] date = newLine.split("[\\s]+");
        if ((date==null)||(date.length<4)||(date[0].length()!=8))
        {
        	System.out.println("newLine5="+newLine);
        	log.error("Transaction not well formatted at line :"+firstLine);
            lastLine=firstLine+1;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        else
        {
            String dateString = date[0].substring(date[0].length()-8,date[0].length())+" "+date[1];
            Date evDate=this.buildTraDate(dateString);
            if (evDate == null)
            {
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;
            }
            tra.setTraDate(evDate);

            // Reference
            try{
                tra.setTraRef(Integer.parseInt(date[2]));
            } catch(Exception ex){
                tra.setTraRef(111111);
                log.error("Exception occured with bad NUM.OP :"+date[2]);
            }
        }

        // Verifier le numero du terminal
        if((!this.gabNumChecked)&&(date!=null)&&(date.length>3)&&(date[3].trim().length()>0))
            this.checkGabNum(date[3]);


        // Ligne :NUM.CARTES     : 4047622000049609
        try {
            lastLine++;
            newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -1;}
        } catch (IOException ex) {
            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
            lastLine=firstLine;
            return -2;
        }
        int pos=-1;
        if (type==TransactionManager.TRANS_TYPE_AUTHEN)
            pos=newLine.indexOf("CARD NBR.      :");
        else
            pos=newLine.indexOf("NUM.CARTES     :");
        if (pos == -1)
            pos = 0;

        String card="";
        String compte="";

        String cardNum=newLine.substring(16+pos).trim();
        if(cardNum.contains("UM.COMPTE     :"))
        {
            log.info("cardNum: "+cardNum);
            int pos1=cardNum.indexOf("UM.COMPTE     :");
            card=cardNum.substring(0,pos1).trim();
            compte=cardNum.substring(pos1+15).trim();
        }
        else
        {
            card=cardNum.trim();
            // Ligne :NUM.COMPTE     : --------------------
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -2;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                ex.printStackTrace();
                return -1;
            }
            if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                pos=newLine.indexOf("ACCOUNT NBR.   :");
            else
                pos=newLine.indexOf("NUM.COMPTE     :");

            if (pos == -1)
                pos = 0;
            compte=newLine.substring(16+pos).trim();
        }
        tra.setTraCardNbr(card.trim());
        if ((compte.trim()!=null) && (!compte.trim().startsWith("----")))
            tra.setTraAccountNbr("XXXXXXXXXXXXXXXXXXXX");
        else
            tra.setTraAccountNbr(compte.trim());

        // Ligne : MNT.RETRAIT     : MAD 1000.00
        boolean mntLineExiste=true;
        if((type==TransactionManager.TRANS_TYPE_RETRAIT)||(type==TransactionManager.TRANS_TYPE_ANNULLE))
        {
             try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

             if ((!newLine.contains("MNT.TRANSACT   :")) && (!newLine.contains("MNT.RETRAIT    :")))
             {
                 mntLineExiste=false;
             }
             else
             {
                if (type==TransactionManager.TRANS_TYPE_RETRAIT)
                    pos=newLine.indexOf("MNT.RETRAIT    :");
                else if (type==TransactionManager.TRANS_TYPE_ANNULLE)
                     pos=newLine.indexOf("MNT.TRANSACT   :");

                if (pos == -1)
                    pos = 0;

                String mnt = newLine.substring(21+pos).trim();
                Float mntFloat=new Float(0);
                if ((mnt!=null)&&(mnt.length()!=0))
                    mntFloat = Float.parseFloat(mnt);
                tra.setTraMontant(mntFloat);
             }
        }

        //  Ligne : CODE REPONSE   : 000
        if (mntLineExiste)
        {
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

        }
        if (type==TransactionManager.TRANS_TYPE_AUTHEN)
            pos=newLine.indexOf("RESPONSE CODE  :");
        else
            pos=newLine.indexOf("CODE REPONSE   :");

        if (pos == -1)
            pos = 0;
        tra.setTraResponseCode(newLine.substring(16+pos,20+pos).trim());
        if (tra.getTraResponseCode().compareTo("000")!=0)
            tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
        if ((tra.getTraType()!=TransactionManager.TRANS_TYPE_CAP_CART)&&(this.isCardPickedUp(tra.getTraResponseCode())))
        {
            tra.setTraType(TransactionManager.TRANS_TYPE_CAP_CART);
        }

        try {
            lastLine++;
            newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
        } catch (IOException ex) {
            log.error("9 Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
            lastLine=firstLine;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        try {
            lastLine++;
            newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
        } catch (IOException ex) {
            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
            lastLine=firstLine;
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }        

        // Sauver la transaction en cours et initailiser une nouvelle
        if ((tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
        {
            traList.add(tra);

            tra = new BrsTransaction();
            //tra.setTraGabId(dbGab.getGabId());
            tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
            tra.setTraRetract(TransactionManager.RETRACT_NOK);
            tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
            tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
            tra.setTraNote1(0);
            tra.setTraNote2(0);
            tra.setTraNote3(0);
            tra.setTraNote4(0);
        }

        while(!newLine.contains("TRANSACTION END"))
        {
            try {
                lastLine++;
                newLine = this.reader.readLine();
		if (newLine==null)
                {
                    if(isForceEnd())
                    {
                        newLine="<- TRANSACTION END";
                        break;
                    }
                    else
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
                    }
                }
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            newLine=newLine.toUpperCase();
            if (newLine.contains("NOTES TAKEN")){
                if (tra.getTraRetract()==TransactionManager.RETRACT_NOK)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
            }
            else if (newLine.contains("CASH RETRACTED")){
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }
            }
            else if ((newLine.contains("BILL/S RETRACTED"))||(newLine.contains("PRESENTER ERROR")))
            {
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }
            }
            else if(newLine.contains("NOTES PRESENTED"))
            {
                this.updateCashPresented(newLine, startDate);
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    processCashPresented(newLine,tra,startDate);
                    cashProcessed=true;
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(newLine,traList.get(indice),startDate);
                        cashProcessed=true;
                    }
                    else
                        cashLine=newLine;
                }
                else
                    cashLine=newLine;
            }
            else if ((newLine.contains("CARD RETAINED BY HOST"))||(newLine.contains("CARD CAPTURED")))
            {
                if ((tra!=null)&&(tra.getTraResponseCode()!=null)&&(tra.getTraResponseCode().length()>0))
                {
                    tra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    BrsTransaction lastTra =traList.get(indice);
                    lastTra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
            }
            else if(newLine.contains("========================================"))
            {
                // Passer a la ligne suivante
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Type transaction
                type=TransactionManager.TRANS_TYPE_INCONNU;
                if (newLine.contains("CASH WITHRAWAL")){
                    type= TransactionManager.TRANS_TYPE_RETRAIT;
                    if (cashLine.length()!=0)
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                else if (newLine.contains("BALANCE INQUIRY")){
                    type= TransactionManager.TRANS_TYPE_DEM_SOLDE;
                }
                 else if (newLine.contains("MINI RELEVE")){
                    type= TransactionManager.TRANS_TYPE_MIN_REL;
                }
                else if (newLine.contains("AUTHENTIFICATION")){
                    type= TransactionManager.TRANS_TYPE_AUTHEN;
                }
                else if (newLine.contains("CAPTURE DE CARTE")){
                    type= TransactionManager.TRANS_TYPE_CAP_CART;
                }
                else if (newLine.contains("TRANSACTION ANNULEE")){
                    type= TransactionManager.TRANS_TYPE_ANNULLE;

                }
                else
                {
                    log.error("Unknown transaction type== ("+newLine+") at line :"+firstLine);
                    lastLine=firstLine+1;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                tra.setTraType(type);
                if (type!=TransactionManager.TRANS_TYPE_RETRAIT)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);

                // sauter 2 lignes
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Date
                date = newLine.split("[\\s]+");
                if ((date==null)||(date.length<4)||(date[0].length()!=8))
                {
                    System.out.println("newLine2="+newLine);
                	log.error("Transaction not well formatted at line :"+firstLine);
                    lastLine=firstLine+1;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                else
                {
                    String dateString = date[0].substring(date[0].length()-8,date[0].length())+" "+date[1];
                    /*
                    DateFormat dateFormat = new SimpleDateFormat("dd/MM/yy HH:mm:ss");
                    Date evDate=null;
                    try {
                        evDate = dateFormat.parse(dateString);
                    } catch (ParseException ex) {
                        log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                        ex.printStackTrace();
                    }
                     * */
                    Date evDate=this.buildTraDate(dateString);
                    if (evDate == null)
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;
                    }
                    tra.setTraDate(evDate);

                    // Reference
                    try{
                        tra.setTraRef(Integer.parseInt(date[2]));
                    } catch(Exception ex){
                        tra.setTraRef(111111);
                        log.error("Exception occured with bad NUM.OP :"+date[2]);
                    }
                }

                // Verifier le numero du terminal
                if((!this.gabNumChecked)&&(date!=null)&&(date.length>3)&&(date[3].trim().length()>0))
                    this.checkGabNum(date[3]);

            // Ligne :NUM.CARTES     : 4047622000049609
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -1;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return -2;
                }
                pos=-1;
                if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                    pos=newLine.indexOf("CARD NBR.      :");
                else
                    pos=newLine.indexOf("NUM.CARTES     :");
                if (pos == -1)
                    pos = 0;

                card="";
                compte="";

                cardNum=newLine.substring(16+pos).trim();
                if(cardNum.contains("UM.COMPTE     :"))
                {
                    log.info("cardNum: "+cardNum);
                    int pos1=cardNum.indexOf("UM.COMPTE     :");
                    card=cardNum.substring(0,pos1).trim();
                    compte=cardNum.substring(pos1+15).trim();
                }
                else
                {
                    card=cardNum.trim();
                    // Ligne :NUM.COMPTE     : --------------------
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return -2;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        ex.printStackTrace();
                        return -1;
                    }
                    if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                        pos=newLine.indexOf("ACCOUNT NBR.   :");
                    else
                        pos=newLine.indexOf("NUM.COMPTE     :");

                    if (pos == -1)
                        pos = 0;
                    compte=newLine.substring(16+pos).trim();
                }
                tra.setTraCardNbr(card.trim());
                if ((compte.trim()!=null) && (!compte.trim().startsWith("----")))
                    tra.setTraAccountNbr("XXXXXXXXXXXXXXXXXXXX");
                else
                    tra.setTraAccountNbr(compte.trim());

                // Ligne : MNT.RETRAIT     : MAD 1000.00
                mntLineExiste=true;
                if((type==TransactionManager.TRANS_TYPE_RETRAIT)||(type==TransactionManager.TRANS_TYPE_ANNULLE))
                {
                     try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }

                     if ((!newLine.contains("MNT.TRANSACT   :")) && (!newLine.contains("MNT.RETRAIT    :")))
                     {
                         mntLineExiste=false;
                     }
                     else
                     {
                        if (type==TransactionManager.TRANS_TYPE_RETRAIT)
                            pos=newLine.indexOf("MNT.RETRAIT    :");
                        else if (type==TransactionManager.TRANS_TYPE_ANNULLE)
                             pos=newLine.indexOf("MNT.TRANSACT   :");

                        if (pos == -1)
                            pos = 0;

                        String mnt = newLine.substring(21+pos).trim();
                        Float mntFloat=new Float(0);
                        if ((mnt!=null)&&(mnt.length()!=0))
                            mntFloat = Float.parseFloat(mnt);
                        tra.setTraMontant(mntFloat);
                     }
                }

                //  Ligne : CODE REPONSE   : 000
                if (mntLineExiste)
                {
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }

                }
                if (type==TransactionManager.TRANS_TYPE_AUTHEN)
                    pos=newLine.indexOf("RESPONSE CODE  :");
                else
                    pos=newLine.indexOf("CODE REPONSE   :");

                if (pos == -1)
                    pos = 0;
                tra.setTraResponseCode(newLine.substring(16+pos,20+pos).trim());
                if (tra.getTraResponseCode().compareTo("000")!=0)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                if ((tra.getTraType()!=TransactionManager.TRANS_TYPE_CAP_CART)&&(this.isCardPickedUp(tra.getTraResponseCode())))
                {
                    tra.setTraType(TransactionManager.TRANS_TYPE_CAP_CART);
                }

                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("9 Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                // Sauver la transaction en cours et initailiser une nouvelle
                if ((tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
                {
                    if ((cashLine.length()!=0) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                    traList.add(tra);

                    tra = new BrsTransaction();
                     //tra.setTraGabId(dbGab.getGabId());
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
                    tra.setTraRetract(TransactionManager.RETRACT_NOK);
                    tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
                    tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
                    tra.setTraNote1(0);
                    tra.setTraNote2(0);
                    tra.setTraNote3(0);
                    tra.setTraNote4(0);
                }
            }
            else if (containsKeyWord(newLine))
            {
                lineToProcess=newLine;
                newLine="TRANSACTION END";
            }            
        }

        if (newLine.contains("TRANSACTION END"))
        {
            if ((tra!=null) && (tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
            {
                if (cashLine.length()!=0)
                {
                    if (
                        ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    &&   ((tra.getTraResponseCode()==null)||(tra.getTraResponseCode().compareTo("000")==0))
                    )
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                traList.add(tra);
            }

            // Enregistrer
            Iterator it = traList.iterator();
            while(it.hasNext())
            {
                BrsTransaction tra1 = (BrsTransaction)it.next();
                
                if(startDate==null)
                    startDate=tra1.getTraDate();
                tra1.setTraInsDate(startDate);

                TransactionManager.setTraNotifRet4Tra(tra1);

                TransactionManager.insert(tra1);
                System.out.println("TransactionManager.insert==================>"+tra1);
                
                if ((lastEventDate==null) || (tra1.getTraInsDate().after(lastEventDate)))
                {
                    lastEventDate=tra1.getTraInsDate();
                }
                 /*if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraDate();    */
                if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraInsDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraInsDate();  
                
                if((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&(tra1.getTraResponseCode().compareTo("000")==0)&&(!cashProcessed))
                    estimateNotesPresented(tra1,startDate);

            }

            if (lineToProcess.length()>0)
                return processLine(lineToProcess);

            if(isForceEnd())
            {
                return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
            }

            return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
        }
        log.error("'TRANSACTION END' not found at line :"+firstLine);
        lastLine=firstLine+1;
        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;

    }

     private int processCuttOff(String line)
     {
    	 System.out.println("processCuttOff "+line);
    	 
    	 int firstLine = this.getLastLine();
        if(!line.contains("CUTOFF"))
        {
            log.error("Transaction line do not contain 'CUTOFF' at line :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        BrsArreteCentral obj= new BrsArreteCentral();
        obj.setArcGabId(dbGab.getGabId());
        obj.setActArgnum(0);

        String newLine="";
        String cashPwcsLine="";
        int cashPwcsLineNbr=0;

        while(!newLine.contains("========================================"))
        {
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            // Les cash counters
            while(!newLine.toUpperCase().contains("ARRETE NO.  :"))
            {
                // THERE IS NO CUT OFF
                if (newLine.toUpperCase().contains("THERE IS NO CUT OFF"))
                {
                    obj=null;
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }
                    break;
                }

                if(newLine.toUpperCase().contains("CASHPWCS"))
                {
                    log.info("line contient CASHPWCS");
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }
                    cashPwcsLine=newLine;
                    cashPwcsLineNbr=lastLine;
                }
                else
                {
                    try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }
                }
            }

            if(obj==null)
                break;

            // Ligne  ARRETE NO.  : 0000105678
            int pos=newLine.indexOf("ARRETE NO.  :");
            if (pos == -1)
            {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }

            obj.setArcNumero(newLine.substring(14+pos).trim());
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            // Ligne ARRETE DATE : 20081017000000
            pos=newLine.indexOf("ARRETE DATE :");
            if (pos == -1)
            {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            String dateString= newLine.substring(14+pos).trim();
            DateFormat dateFormat = new SimpleDateFormat("yyyyMMddhhmmss");
            Date evDate=null;
            try {
                evDate = dateFormat.parse(dateString);
            } catch (ParseException ex) {
                log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine);
                ex.printStackTrace();
            }
            if (evDate == null)
            {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;
            }
            obj.setArcDate(evDate);

            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //CAPTURE NBR.: 000000
            pos=newLine.indexOf("CAPTURE NBR.:");
            if (pos == -1)
            {
                log.warn("Cutoff not wel formatted at line 1 :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setArcCapture(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line 2 :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //TRANCHE     : 00000079-00999932
            pos=newLine.indexOf("TRANCHE     :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            
            obj.setArcTranche(newLine.substring(14+pos).trim());
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //MONNAIE     : MAD
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //APP TRN NBR : 000011
            pos=newLine.indexOf("APP TRN NBR :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setArcAppTrnNbr(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //APP TRN AMT : MAD 10700.00
            pos=newLine.indexOf("APP TRN AMT :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setArcAppTrnAmt(Float.parseFloat(newLine.substring(18+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //REV TRN NBR : 000000
            pos=newLine.indexOf("REV TRN NBR :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setArcRevTrnNbr(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //APP TRN AMT : MAD 10700.00
            pos=newLine.indexOf("REV TRN AMT :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
               obj.setArcRevTrnAmt(Float.parseFloat(newLine.substring(18+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //APPSUSP NBR : 000000
           pos=newLine.indexOf("APPSUSP NBR :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
               obj.setArcAppsuspNbr(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }          
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //APPSUSP AMT : MAD 0.00
            pos=newLine.indexOf("APPSUSP AMT :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setArcAppSuspAmt(Float.parseFloat(newLine.substring(18+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //--------------------
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            // ACTUEL DATE : 081017094923
            pos=newLine.indexOf("ACTUEL DATE :");
            if (pos == -1)
            {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            dateString= newLine.substring(14+pos).trim();
            //dateFormat = new SimpleDateFormat("yyMMddhhmmss");
            dateFormat = new SimpleDateFormat("yyMMddHHmmss");
            evDate=null;
            try {
                evDate = dateFormat.parse(dateString);
            } catch (ParseException ex) {
                log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine);
                ex.printStackTrace();
            }
            if (evDate == null)
            {
                 log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;
            }
            obj.setActDate(evDate);
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            // APP TRN NBR : 000000
            pos=newLine.indexOf("APP TRN NBR :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setActAppTrnNbr(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            // APP TRN AMT : MAD 86900.00
            pos=newLine.indexOf("APP TRN AMT :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
               obj.setActAppTrnAmt(Float.parseFloat(newLine.substring(18+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            // REV TRN NBR : 000000
            pos=newLine.indexOf("REV TRN NBR :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
               obj.setActRevTrnNbr(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            // REV TRN AMT : MAD 0.00
            pos=newLine.indexOf("REV TRN AMT :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
               obj.setActRevTrnAmt(Float.parseFloat(newLine.substring(18+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

            //  APPSUSP NBR : 000000
            pos=newLine.indexOf("APPSUSP NBR :");
            if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
               obj.setActAppsuspNbr(Integer.parseInt(newLine.substring(14+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }

             // APPSUSP AMT : MAD 0.00
            pos=newLine.indexOf("APPSUSP AMT :");
           if (pos == -1){
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try{
                obj.setActAppsuspAmt(Float.parseFloat(newLine.substring(18+pos).trim()));
            } catch (Exception ex) {
                log.warn("Cutoff not wel formatted at line :"+lastLine);
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }
            try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
        }
        if (obj!=null)
        {
            //Insdate
            Date newDate=obj.getActDate();

            if (lastEventDate!=null)
            {
                newDate = new Date(lastEventDate.getTime()+1000);
            }

            // Process CASHPWCS Line
            if(cashPwcsLine.length()!=0)
            {
                log.info("cashPwcsLine: "+cashPwcsLine);
                log.info("cashPwcsLineNbr: "+cashPwcsLineNbr);
                log.info("processCuttof, Insdate avant processCutoffCash: "+newDate);
                Date cashEvDate=this.processCutoffCash(newDate, cashPwcsLine);
                log.info("processCuttof, Insdate apres processCutoffCash: "+newDate);
                if(cashEvDate!=null)
                {
                    log.info("cashEvDate: "+cashEvDate);
                    //this.lastCashLine=cashPwcsLineNbr;                        
                    this.lastCashFileName=this.getCurrentFile();

                    newDate = new Date(lastEventDate.getTime()+1000);
                }
            }

            obj.setArcInsDate(newDate);
            lastEventDate=newDate;

            //ArreteCentralManager.insert(obj);
            System.out.println("ArreteCentralManager.insert==================>"+obj);
            this.estimateCashCounter(obj);          
        }

        return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
     }

    private int processCashPresented(String line, BrsTransaction tra, Date startDate){

    	System.out.println("processCashPresented "+line);
    	//log.error("Notes Presented: "+tra.getTraMontant());
        //log.error("line :"+line);
        //13:36:05 NOTES PRESENTED 1,0,0,0
        if(!line.contains("NOTES PRESENTED"))
        {
            log.error("Cash presented line do not contain 'NOTES PRESENTED' at line :"+(this.getLastLine()-1));

            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        int[] nbrCas=new int[4];

        
        String[] ligne = line.split("*");

        Date date = null;
        String strDate ="";
        SimpleDateFormat dateTimesFormat=new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        SimpleDateFormat dateFormat=new SimpleDateFormat("dd/MM/yyyy");

        if (startDate!=null)
        {
             strDate = dateFormat.format(startDate) + " " + ligne[1];
        }
        else if((tra!=null)&& (tra.getTraDate()!=null))
        {
            strDate = dateFormat.format(tra.getTraDate()) + " " + ligne[1];
        }
        if (strDate.length()>0)
        {
            try {
                date = dateTimesFormat.parse(strDate);
            } catch (ParseException ex) {
                log.error("Imparsable date :"+strDate+" exception :"+ex.getMessage());
                log.error("Processed line :"+line);
                ex.printStackTrace();
            }
        }
        // Tenter autre chose
        if (date == null)
            date=getDateForLine(ligne[1]);

        lastEventDate=date;
        
        ligne[2]=ligne[2].replace("NOTES PRESENTED:", "");
        String[] unBi=ligne[2].split(",");

        nbrCas[0]=Integer.parseInt(unBi[0]);
        nbrCas[1]=Integer.parseInt(unBi[1]);
        nbrCas[2]=Integer.parseInt(unBi[2]);
        nbrCas[3]=Integer.parseInt(unBi[3]);

        tra.setTraNote1(nbrCas[0]);
        tra.setTraNote2(nbrCas[1]);
        tra.setTraNote3(nbrCas[2]);
        tra.setTraNote4(nbrCas[3]);

         return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
      }

    private int updateCashPresented(String line, Date startDate){

    	System.out.println("updateCashPresented "+line);
    	
    	//log.error("Notes Presented: "+tra.getTraMontant());
        //log.error("line :"+line);
        //13:36:05 NOTES PRESENTED 1,0,0,0
        if(!line.contains("NOTES PRESENTED"))
        {
            log.error("Cash presented line do not contain 'NOTES PRESENTED' at line :"+(this.getLastLine()-1));

            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        int[] nbrCas=new int[4];

        
        String[] ligne = line.split("[*]");

        
        Date date = null;
        String strDate ="";
        SimpleDateFormat dateTimesFormat=new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        SimpleDateFormat dateFormat=new SimpleDateFormat("dd/MM/yyyy");

        if (startDate!=null)
        {
            strDate = dateFormat.format(startDate) + " " + ligne[1];
        }
        if (strDate.length()>0)
        {
            try {
                date = dateTimesFormat.parse(strDate);
            } catch (ParseException ex) {
                log.error("Imparsable date :"+strDate+" exception :"+ex.getMessage());
                log.error("Processed line :"+line);
                ex.printStackTrace();
            }
        }
        // Tenter autre chose
        if (date == null)
            date=getDateForLine(ligne[1]);

        lastEventDate=date;

        ligne[2]=ligne[2].replace("NOTES PRESENTED:", "");
        String[] unBi=ligne[2].split(",");

        nbrCas[0]=Integer.parseInt(unBi[0]);
        nbrCas[1]=Integer.parseInt(unBi[1]);
        nbrCas[2]=Integer.parseInt(unBi[2]);
        nbrCas[3]=Integer.parseInt(unBi[3]);


        ArrayList<BrsCassette> listCass= null;//CassetteManager.listCassGab(dbGab.getGabId());
        if((listCass==null)||(listCass.isEmpty()))
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;

        int newTotal = 0;
        int oldTotal = 0;

        Iterator it=listCass.iterator();
        while(it.hasNext())
        {
            BrsCassette cas=(BrsCassette)it.next();
            if (cas.getCasNotes()!=null)
                oldTotal+=cas.getCasNotes();

            if(nbrCas[cas.getCasOrder()-1]!=0)
            {
                if ((cas.getCasDate() == null)||(cas.getCasDate().before(date)))
                {
                    int notes = cas.getCasNotes()-nbrCas[cas.getCasOrder()-1];
                    if(notes<0)
                    {
                        log.error("valeur cassette incorrecte:"+notes+" for cassette:"+cas.getCasOrder());
                        notes = 0;
                    }
                    cas.setCasNotes(notes);
                    cas.setCasDate(date);
                    //CassetteManager.update(cas);
                }
            }
            if (cas.getCasNotes()!=null)
                newTotal+=cas.getCasNotes();
        }

        this.updateCasSeuil(oldTotal, newTotal);

         return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
      }

     private int processSupMode(String line){

    	 System.out.println("processSupMode "+line);
    	 
    	 int firstLine = this.getLastLine();
        if(!line.contains("TYPE1-10000")) //SUPERVISOR MODE ENTRY
        {
            log.error("Supmode line do not contain 'SUPERVISOR MODE ENTRY' at line :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        // La date
        Date evDate=null;
        //Date dateDeb=null;
        //Date dateFin=null;

        //boolean coffreOuvert=false;

        evDate = this.getDateFromLine(lineBefore,true);
        if (lastEventDate!=null)
        {
            if ((evDate==null)|| (!evDate.after(lastEventDate)))
                evDate = new Date(lastEventDate.getTime()+1000);
        }
        if(lastRetraitDate!=null)
        {
            if ((evDate==null)|| (!evDate.after(lastRetraitDate)))
                evDate = new Date(lastRetraitDate.getTime()+1000);
        }
        
        if (evDate == null)
            return LogAnalyser.LOG_ANALYSER_INCORRECT_DATE_FORMAT;

        lastEventDate=evDate;
        
        String newLine=line;
        /*try {
                lineBefore=newLine;
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            }
        catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }*/

        String lineToProcess="";
       
        while(!newLine.contains("LAST CLEARED"))//SUPERVISOR MODE EXIT"))
        {
            if(newLine.contains("TYPE1-10000 TYPE2-5000"))
            {
                if ((lastEventDate!=null) && (!evDate.after(lastEventDate)))
                    evDate = new Date(lastEventDate.getTime()+1000);

                readCashCounter(evDate,newLine,this.cashCleard);

                if ((lastEventDate!=null) && (!evDate.after(lastEventDate)))
                    evDate = new Date(lastEventDate.getTime()+1000);                
            }
            else if ((newLine.contains("CASSETTE REMOVED"))
            || (newLine.contains("REJECT BIN REMOVED"))
            || (newLine.contains("REJECT BIN INSERTED"))
            || (newLine.contains("CASSETTE INSERTED"))){

               /*coffreOuvert=true;
               Date coeDate=getDateFromLine(lineBefore,true);
               if(coeDate!=null){
                   if((newLine.contains("REMOVED")&&(dateDeb==null))){
                       dateDeb=coeDate;
                   }
                   else if(newLine.contains("INSERTED")){
                       if ((dateFin==null) || (coeDate.after(dateFin)))
                           dateFin=coeDate;
                   }
               }
               if ((coeDate!=null) && (!evDate.after(coeDate)))
                    evDate = new Date(coeDate.getTime()+1000);
                * */
                this.processSafeDoor(newLine);

            }

            else if (newLine.contains("CASH COUNTS CLEARED"))
            {              
                this.cashCleard=true;
            }
            else if (newLine.contains("CASH ADDED"))
            {
//                Date lineBeforeDate = this.getDateFromLine(lineBefore,true);
                 if ((lastEventDate!=null) && (!evDate.after(lastEventDate)))
                    evDate = new Date(lastEventDate.getTime()+1000);

                 log.info("lastEventDate avant --CashAdded--: "+lastEventDate);
                 //if(processCashAdded(evDate,newLine,this.cashCleard)==LogAnalyser.LOG_ANALYSER_REFRESH_OK)
                    if(this.processCashAdded(evDate,newLine,this.cashCleard)!=LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR)
                        this.cashCleard=false;

                 log.info("lastEventDate apres --CashAdded--: "+lastEventDate);
                 if ((lastEventDate!=null) && (!evDate.after(lastEventDate)))
                    evDate = new Date(lastEventDate.getTime()+1000);
                
            }
            else if (this.containsKeyWord(newLine))
            {
                lineToProcess=newLine;
                break;
            }
            
            try {
                lineBefore=newLine;
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
        }

        /*
        if(coffreOuvert)
        {
            if((dateDeb==null)&&(dateFin==null))
            {
                dateDeb=evDate;
                dateFin=new Date(dateDeb.getTime()+60000);                
            }
            else if(dateDeb==null){
                dateDeb=new Date(dateFin.getTime()-60000);
            }
            else if(dateFin==null){
                dateFin=new Date(dateDeb.getTime()+60000);
            }
            else if (!dateFin.after(dateDeb)){
                dateFin=new Date(dateDeb.getTime()+60000);
            }
            insererCoe(dateDeb,dateFin);
        }
         * */

        if(lineToProcess.length()>0)
            return processLine(lineToProcess);

        return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
     }

     private int insererCoe(Date dateOuv,Date dateFer){
        if((dateOuv==null)||(dateFer==null))
            return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
        
        BrsCoffreEvent event=new BrsCoffreEvent(dbGab.getGabId(), dateOuv, CoffreManager.EVENT_OUVERT,0,CoffreManager.NOTIF_NOT_NEEDED);
        if (CoffreManager.isCoeNotifNedded(event))
            event.setCoeNotif(CoffreManager.NOTIF_NEEDED);
        
        /*-------------- Debut Bug 662 ------------------*/
        BrsCoffreEvent lastCoeEvent = CoffreManager.getLastEvent(this.dbGab.getGabId());        
        if(lastCoeEvent!=null)
        {
            if(!event.getCoeDate().after(lastCoeEvent.getCoeDate()))
            {
                event.setCoeDate(new Date(lastCoeEvent.getCoeDate().getTime()+1000));
            }
        }
        Date lastCoeDate=event.getCoeDate();
        /*--------------  Fin  Bug 662 ------------------*/
        
        CoffreManager.insert(event);
        System.out.println("CoffreManager.insert==================>"+event);

        event=new BrsCoffreEvent(dbGab.getGabId(), dateFer, CoffreManager.EVENT_FERME,0,CoffreManager.NOTIF_NOT_NEEDED);
        if (CoffreManager.isCoeNotifNedded(event))
            event.setCoeNotif(CoffreManager.NOTIF_NEEDED);
        
         /*-------------- Debut Bug 662 ------------------*/
        if(!event.getCoeDate().after(lastCoeDate))
        {
            event.setCoeDate(new Date(lastCoeDate.getTime()+1000));
        }
        /*--------------  Fin  Bug 662 ------------------*/
        
        CoffreManager.insert(event);
        System.out.println("CoffreManager.insert==================>"+event);

         return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
     }

     private int processCashAdded(Date evDate,String line,boolean cashCleard) 
     {
    	 System.out.println("processCashAdded "+line);
    	 
    	 int firstLine=this.getLastLine();
         String newLine=line;
         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }

         // TYPE 1 =  2034  TYPE 2 =  1036
         if ((!newLine.contains("TYPE 1 =")) || (!newLine.contains("TYPE 2 =")))
         {
             log.error("Not well formatted cash add line at :"+firstLine);
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         int pos = newLine.indexOf("TYPE 1 =");
         int cas1 = Integer.parseInt(newLine.substring(pos+8,pos+16).trim());
         int cas2 = Integer.parseInt(newLine.substring(pos+24,pos+30).trim());

         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }

         // TYPE 3 =  2034  TYPE 4 =  1036
         if ((!newLine.contains("TYPE 3 =")) || (!newLine.contains("TYPE 4 =")))
         {
             log.error("Not well formatted cash add line at :"+firstLine);
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         pos = newLine.indexOf("TYPE 3 =");
         int cas3 = Integer.parseInt(newLine.substring(pos+8,pos+16).trim());
         int cas4 = Integer.parseInt(newLine.substring(pos+24,pos+30).trim());

         if ((cas1==0)&&(cas2==0)&&(cas3==0)&&(cas4==0))
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                  
         /*if   ((lastCashFileName!=null)
             &&(lastCashFileName.length()>0)
             &&(lastCashLine>0)
             &&(lastCashFileName.compareTo(this.getCurrentFile())==0)
             &&(lastCashLine>=firstLine))
         {
             return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
         }*/
         if(this.cashAlreadyProc(evDate, firstLine))
         {
             log.info("processCashAdded---lastLine: "+lastLine);
             return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
         }
         
        BrsCashCounter cash= new BrsCashCounter();
        cash.setCacGabId(dbGab.getGabId());
        
        Date realDate = this.getDateFromLine(lineBefore,true);

        if ((realDate == null) || (!realDate.after(evDate)))
            realDate=evDate;     

        this.lastEventDate=realDate;

        cash.setCacDate(realDate);

        cash.setCacTraite(CashCounterManager.CASH_TRAITE_INST);
        cash.setCacType(CashCounterManager.CASH_COUNTER_TYPE_P);

         // insert data
         cash.setCacCas1Tot(cas1);
         cash.setCacCas1Disp(0);
         cash.setCacCas1Rej(0);

         cash.setCacCas2Tot(cas2);
         cash.setCacCas2Disp(0);
         cash.setCacCas2Rej(0);

         cash.setCacCas3Tot(cas3);
         cash.setCacCas3Disp(0);
         cash.setCacCas3Rej(0);

         cash.setCacCas4Tot(cas4);
         cash.setCacCas4Disp(0);
         cash.setCacCas4Rej(0);

          //inserer cash
        /*cash.setCacCas1Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas1().intValue());
        cash.setCacCas2Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas2().intValue());
        cash.setCacCas3Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas3().intValue());
        cash.setCacCas4Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas4().intValue());*/
        cash.setCacCas1Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
        cash.setCacCas2Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
        cash.setCacCas3Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
        cash.setCacCas4Etat(CashCounterManager.CASH_COUNTER_ETAT_O);

        //si il n'a pas fait cash cleared
        if(!cashCleard){
            BrsCashCounter lastCash = CashCounterManager.getCashBeforeDate(cash.getCacGabId(),cash.getCacDate());
            if(lastCash!=null){

                int[] notes=this.getCasNotes();

                 cash.setCacCas1Tot(cas1+lastCash.getCacCas1Tot());
                 cash.setCacCas1Disp(lastCash.getCacCas1Tot()-lastCash.getCacCas1Rej()-notes[0]);
                 cash.setCacCas1Rej(lastCash.getCacCas1Rej());

                 cash.setCacCas2Tot(cas2+lastCash.getCacCas2Tot());
                 cash.setCacCas2Disp(lastCash.getCacCas2Tot()-lastCash.getCacCas2Rej()-notes[1]);
                 cash.setCacCas2Rej(lastCash.getCacCas2Rej());

                 cash.setCacCas3Tot(cas3+lastCash.getCacCas3Tot());
                 cash.setCacCas3Disp(lastCash.getCacCas3Tot()-lastCash.getCacCas3Rej()-notes[2]);
                 cash.setCacCas3Rej(lastCash.getCacCas3Rej());

                 cash.setCacCas4Tot(cas4+lastCash.getCacCas4Tot());
                 cash.setCacCas4Disp(lastCash.getCacCas4Tot()-lastCash.getCacCas4Rej()-notes[3]);
                 cash.setCacCas4Rej(lastCash.getCacCas4Rej());
            }
        }

        cash.setCacLastcashLine(String.valueOf(firstLine));
        BrsCashCounter newCash = CashCounterManager.insert(cash);
        System.out.println("CashCounterManager.insert==================>"+cash);
        log.info("ProcessCashAdded!!:cashCounter est inséré:"+cash.getCacDate());
        log.info("--ProcessCashAdded--lastEventDate: "+lastEventDate);
        if(this.getCurrentFile()!=null)
             lastCashFileName=this.getCurrentFile();
        lastCashLine=firstLine;
        if (newCash!=null)
        {
            calculCashAlim(cash);
            updateCass(cash);
        }
        else
        {
            log.error("Not inserted");
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        
         return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
     }

     private boolean cashAlreadyProc(Date evDate,int lastLineNbr){

         if(evDate==null)
             return false;

         SimpleDateFormat formatD=new SimpleDateFormat("yyyy-MM-dd");

         String whereCac = " where cacGabId="+dbGab.getGabId();
         whereCac+=" and cacDate<='"+formatD.format(evDate)+" 23:59:59'";
         whereCac+=" and cacDate>='"+formatD.format(evDate)+" 00:00:00'";
         whereCac+=" and cacLastcashLine='"+lastLineNbr+"'";
         log.info("whereCac: "+whereCac);
         ArrayList<BrsCashCounter> myList = CashCounterManager.filter(whereCac,"",0,0);

         return ((myList!=null)&&(!myList.isEmpty()));

     }
     
    private int readCashCounter(Date evDate,String line,boolean cashCleard) {
        
    	System.out.println("readCashCounter "+line);
    	/*if   ((lastCashFileName!=null)
             &&(lastCashFileName.length()>0)
             &&(lastCashLine>0)
             &&(lastCashFileName.compareTo(this.getCurrentFile())==0)
             &&(lastCashLine>=this.getLastLine()))
         {
             return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
         }*/
        int firstLine=this.getLastLine();
         if(this.cashAlreadyProc(evDate,firstLine))
         {
             log.info("readCashCounter---lastLine: "+lastLine);
             return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
         }

        BrsCashCounter cash= new BrsCashCounter();
        //cash.setCacGabId(dbGab.getGabId());
        cash.setCacDate(evDate);
        lastEventDate=evDate;
        cash.setCacTraite(CashCounterManager.CASH_TRAITE_INST);
        cash.setCacType(CashCounterManager.CASH_COUNTER_TYPE_S);
        String newLine=line;
         //saut
            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

                    /***** cas1 && cas2*****/

            //Valeurs
            String[] cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=4))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                    cash.setCacCas1Val(Integer.parseInt(cas[2]));
                    cash.setCacCas2Val(Integer.parseInt(cas[3]));

            }
            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

            //Rejets
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=3))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas1Rej(Integer.parseInt(cas[1]));
                cash.setCacCas2Rej(Integer.parseInt(cas[2]));
            }

            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
           /*  try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }*/

            //Dispensed
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=3))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas1Disp(Integer.parseInt(cas[1]));
                cash.setCacCas2Disp(Integer.parseInt(cas[2]));
            }

            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
            
            //DEPOSITED

            //Total
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=3))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas1Tot(Integer.parseInt(cas[1]));
                cash.setCacCas2Tot(Integer.parseInt(cas[2]));
            }
            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
             try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
             /* try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }*/

                    /***** cas3 && cas4*****/
            //Valeurs
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=4))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas3Val(Integer.parseInt(cas[2]));
                cash.setCacCas4Val(Integer.parseInt(cas[3]));
            }
            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

             //Rejets
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=3))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas3Rej(Integer.parseInt(cas[1]));
                cash.setCacCas4Rej(Integer.parseInt(cas[2]));
            }

            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
             try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

            //Dispensed
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=3))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas3Disp(Integer.parseInt(cas[1]));
                cash.setCacCas4Disp(Integer.parseInt(cas[2]));
            }

            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }

            //=Total
            cas=newLine.split("[\\s]+");
            if((cas==null)|| (cas.length!=3))
            {
                lastLine=firstLine+1;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            else
            {
                cash.setCacCas3Tot(Integer.parseInt(cas[1]));
                cash.setCacCas4Tot(Integer.parseInt(cas[2]));
            }

            //last cleared
             String before=newLine;
            try {
                    lastLine++;
                    newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                } catch (IOException ex) {
                    log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                    lastLine=firstLine;
                    ex.printStackTrace();
                    return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                }
                 processLastCleared(newLine,before,evDate);

                 //CARDS CAPTURED    00005
            /* try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
             try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
             try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
            } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                ex.printStackTrace();
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            int pos=newLine.indexOf("CARDS CAPTURED    ");
            if (pos == -1){
                log.warn("Error on CARDS CAPTURED at line :"+lastLine);             
            }
            else
            {
                String[] carte=newLine.split("[\\s]+");
                if ((carte!=null) && (carte.length>3))
                cash.setCacCarte(Integer.parseInt(carte[3]));

                 //last cleared
                 before=newLine;
                try {
                        lastLine++;
                        newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                    } catch (IOException ex) {
                        log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                        lastLine=firstLine;
                        ex.printStackTrace();
                        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                    }
                     processLastCleared(newLine,before,evDate);
            }*/
            /*
            //inserer cash
            //cash.setCacCas1Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas1().intValue());
            //cash.setCacCas2Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas2().intValue());
            //cash.setCacCas3Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas3().intValue());
            //cash.setCacCas4Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas4().intValue());
            cash.setCacCas1Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
            cash.setCacCas2Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
            cash.setCacCas3Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
            cash.setCacCas4Etat(CashCounterManager.CASH_COUNTER_ETAT_O);

            if(
               (cashCleard)
             &&((cash.getCacCas1Tot()-cash.getCacCas1Disp()-cash.getCacCas1Rej())==0)
             &&((cash.getCacCas2Tot()-cash.getCacCas2Disp()-cash.getCacCas2Rej()==0))
             &&((cash.getCacCas3Tot()-cash.getCacCas3Disp()-cash.getCacCas3Rej()==0))
             &&((cash.getCacCas4Tot()-cash.getCacCas4Disp()-cash.getCacCas4Rej())==0)
             )
            {
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
            }*/

            cash.setCacLastcashLine(String.valueOf(firstLine));
            CashCounterManager.insert(cash);
            System.out.println("CashCounterManager.insert==================>"+cash);
            log.info("ReadCashCounter!!:cashCounter est inséré:"+cash.getCacDate());
            /*if(this.getCurrentFile()!=null)
            lastCashFileName=this.getCurrentFile();
            lastCashLine=firstLine;
            if (cash!=null)
            {
                //calculCashAlim(cash);
                updateCass(cash);
            }*/

      return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
    }

     private int processLastCleared(String newLine,String before,Date cocDate) {
    	 System.out.println("processLastCleared "+newLine);
    	 log.debug("processLastCleared");
         log.debug(before);
         log.debug(newLine);
         log.debug(cocDate);

        if(!newLine.contains("LAST CLEARED"))
        {
            log.error("ProcessCountClear line does not contain 'LAST CLEARED' !!!");
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }
        //date
        Date evDate=null;
        if(!newLine.contains("00/00/00"))
        {
            log.debug("newLine contains 00/00/00");
            evDate=this.getDateFromLine(newLine, false);
        }
        else
        {

        }
        log.debug("evDate "+evDate);

        //Type
        int type=CountClearManager.CLEAR_TYPE_UNKNOWN;
        int nombre = 0;

        if(before.contains("=TOTAL         00000     00000"))
            type=CountClearManager.CLEAR_TYPE_CASH;

        else if(before.contains("CARDS CAPTURED"))
        {
            type=CountClearManager.CLEAR_TYPE_CARD;
            int pos=before.indexOf("CARDS CAPTURED");
            if (pos != -1)
                pos=0;
            
            if(before.trim().length()>pos+22){
                log.debug("Nombre :"+before.substring(pos+19, pos+24));
                nombre = Integer.parseInt(before.substring(pos+19, pos+24).trim());
            }
            else
                return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
        }

      //insérer l'evenement
        BrsCountClear clear=null;
         String where=" where cocGabId="+this.dbGab.getGabId()+" and cocType="+type;
         log.debug("where :"+where);

         ArrayList<BrsCountClear> clears=CountClearManager.filter(where, "", 0, 1);
         if((clears==null)||(clears.isEmpty())){
             log.debug("No clear found in db");
             //this.dbGab.getGabId()
             clear=new BrsCountClear(0,evDate,type,nombre,cocDate);
             CountClearManager.insert(clear);
             System.out.println("CountClearManager.insert==================>"+clear);
         }
         else
         {
             clear=clears.get(0);
             clear.setCocNombre(nombre);
             if(evDate!=null)
                clear.setCocClearDate(evDate);
             clear.setCocDate(cocDate);
             CountClearManager.update(clear);
         }

         if ((clear!=null) && (clear.getCocType()==CountClearManager.CLEAR_TYPE_RETRACT))
            this.updateRetract(clear.getCocDate());

      return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
    }

     private int processPowerInterupt(String line) {

    	 System.out.println("processPowerInterupt "+line);
    	 
        int firstLine=this.getLastLine();
        Date evDate = this.getDateFromLine(lineBefore,true);
        if (evDate==null)
        {
             log.error("getCoeDate failed for line :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }

        if(this.cashAlreadyProc(evDate, firstLine))
         {
             log.info("processCashAdded---lastLine: "+lastLine);
             return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
         }

        BrsCashCounter cash= new BrsCashCounter();
        cash.setCacGabId(dbGab.getGabId());
        cash.setCacDate(evDate);

        cash.setCacTraite(CashCounterManager.CASH_TRAITE_INST);
        cash.setCacType(CashCounterManager.CASH_COUNTER_TYPE_P);

         String newLine=line;
         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }

         // TYPE 1 =  2034  TYPE 2 =  1036
         if ((!newLine.contains("TYPE 1 =")) || (!newLine.contains("TYPE 2 =")))
         {
             log.error("Not well formatted cash add line at :"+firstLine);
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         int pos = newLine.indexOf("TYPE 1 =");
         int disp1 = Integer.parseInt(newLine.substring(pos+8,pos+16).trim());
         int disp2 = Integer.parseInt(newLine.substring(pos+24,pos+30).trim());

         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }

         // TYPE 3 =  2034  TYPE 4 =  1036
         if ((!newLine.contains("TYPE 3 =")) || (!newLine.contains("TYPE 4 =")))
         {
             log.error("Not well formatted cash add line at :"+firstLine);
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         pos = newLine.indexOf("TYPE 3 =");
         int disp3 = Integer.parseInt(newLine.substring(pos+8,pos+16).trim());
         int disp4 = Integer.parseInt(newLine.substring(pos+24,pos+30).trim());

          //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }

         // TYPE 1 =  2034  TYPE 2 =  1036
         if ((!newLine.contains("TYPE 1 =")) || (!newLine.contains("TYPE 2 =")))
         {
             log.error("Not well formatted cash add line at :"+firstLine);
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         pos = newLine.indexOf("TYPE 1 =");
         int rem1 = Integer.parseInt(newLine.substring(pos+8,pos+16).trim());
         int rem2 = Integer.parseInt(newLine.substring(pos+24,pos+30).trim());

         //saut
         try {
                lastLine++;
                newLine = this.reader.readLine();if (newLine==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
         } catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }

         // TYPE 3 =  2034  TYPE 4 =  1036
         if ((!newLine.contains("TYPE 3 =")) || (!newLine.contains("TYPE 4 =")))
         {
             log.error("Not well formatted cash add line at :"+firstLine);
             return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
         }
         pos = newLine.indexOf("TYPE 3 =");
         int rem3 = Integer.parseInt(newLine.substring(pos+8,pos+16).trim());
         int rem4 = Integer.parseInt(newLine.substring(pos+24,pos+30).trim());


         // insert data
         cash.setCacCas1Tot(disp1+rem1);
         cash.setCacCas1Disp(disp1);
         cash.setCacCas1Rej(0);

         cash.setCacCas2Tot(disp2+rem2);
         cash.setCacCas2Disp(disp2);
         cash.setCacCas2Rej(0);

         cash.setCacCas3Tot(disp3+rem3);
         cash.setCacCas3Disp(disp3);
         cash.setCacCas3Rej(0);

         cash.setCacCas4Tot(disp4+rem4);
         cash.setCacCas4Disp(disp4);
         cash.setCacCas4Rej(0);

          //inserer cash
        /*cash.setCacCas1Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas1().intValue());
        cash.setCacCas2Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas2().intValue());
        cash.setCacCas3Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas3().intValue());
        cash.setCacCas4Val(ServerCtx.getInsatance().getGlobalParam().getGlpValCas4().intValue());*/
        cash.setCacCas1Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
        cash.setCacCas2Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
        cash.setCacCas3Etat(CashCounterManager.CASH_COUNTER_ETAT_O);
        cash.setCacCas4Etat(CashCounterManager.CASH_COUNTER_ETAT_O);

        cash.setCacLastcashLine(String.valueOf(firstLine));
        System.out.println("CashCounterManager.insert==================>"+cash);
        CashCounterManager.insert(cash);
        log.info("processPowerInterupt!!:cashCounter est inséré:"+cash.getCacDate());
        if (cash!=null)
        {
            //calculCashAlim(cash);
            updateCass(cash);
        }

         return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
     }

    @Override
    protected void signalFirstFile(String fileName)
    {
        if((fileName==null)||(fileName.length()==0))
            return;

        BrsLostFiles lof=null;//LostfilesManager.firstFile(dbGab.getGabId());
        if(lof!=null)
            return;
        
        lof=new BrsLostFiles();
        //lof.setLofGabId(dbGab.getGabId());

        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        Date logDate=null;
        try {
            logDate = format.parse(this.getDateFromFileName(fileName));
            logDate = new Date(logDate.getTime()-86400000);
        } catch (Exception ex) {
            log.error("Error during signalFirstFile logdate : "+fileName);
            ex.printStackTrace();
        }
        lof.setLofDate(logDate);

        lof.setLofEtat(LostfilesManager.ETAT_FIST_FILE);
        lof.setLofName(fileName);
        //LostfilesManager.insert(lof);
    }

    @Override
    protected void signalEmptyFiles(String fName)
    {
        if((fName==null)||(fName.length()==0))
            return;

        if (fName.compareTo("EJDATA.LOG")==0)
            return;

        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        String sDate = getDateFromFileName(fName);
        if((sDate==null)||(sDate.length()<1))
            return;
        Date fDate=null;
        try {
            fDate = format.parse(sDate);
            fDate = new Date(fDate.getTime()-86400000);
        } catch (ParseException ex) {
            log.error("Error during signalEmptyFiles sDate : "+sDate);
            ex.printStackTrace();
        }
        this.signalLostFiles(fDate, LostfilesManager.ETAT_EMPTY_FILE);
    }
    

    private int processTraComplete2(String line){

    	System.out.println("processTraComplete "+line);
    	
        int firstLine = this.getLastLine();
        if(!line.contains("-------------------------"))
        {
            log.error("Transaction line do not contain '*TRANSACTION START' at line :"+firstLine);
            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
        }       
        
        // Retrouver la date sur la line before
        Date startDate = this.getDateFromLine(lineBefore,true);
        if(lastEventDate!=null)
         {
             if((startDate==null)||(lastEventDate.after(startDate)))
             {
                 startDate=new Date(lastEventDate.getTime()+1000);
                 lastEventDate=startDate;
             }
         }

        BrsTransaction tra = new BrsTransaction();
        ArrayList<BrsTransaction> traList = new ArrayList<BrsTransaction>();
        boolean cashProcessed=false;

        // Gab
        //tra.setTraGabId(dbGab.getGabId());
        tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
        tra.setTraRetract(TransactionManager.RETRACT_NOK);
        tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
        tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
        tra.setTraNote1(0);
        tra.setTraNote2(0);
        tra.setTraNote3(0);
        tra.setTraNote4(0);

        String newLine="";
        String cashLine="";
        String lineToProcess="";

        while(!newLine.contains("TRANSACTION END"))
        {
            try {
                lastLine++;
                newLine = this.reader.readLine();
                if (newLine==null)
                {
                    if(isForceEnd())
                    {
                        newLine="<- TRANSACTION END";
                        break;
                    }
                    else
                    {
                        lastLine=firstLine;
                        return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
                    }
                }
            }
            catch (IOException ex) {
                log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                lastLine=firstLine;
                return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
            }
            newLine=newLine.toUpperCase();
            if (newLine.contains("CASH TAKEN")){
                if (tra.getTraRetract()==TransactionManager.RETRACT_NOK)
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
            }
            else if (newLine.contains("CASH RETRACTED")){
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }

            }
            else if ((newLine.contains("BILL/S RETRACTED"))||(newLine.contains("PRESENTER ERROR")))
            {
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    tra.setTraRetract(TransactionManager.RETRACT_OK);
                    tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        traList.get(indice).setTraRetract(TransactionManager.RETRACT_OK);
                        traList.get(indice).setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);
                    }
                }
            }
            else if(newLine.contains("CASH PRESENTED"))
            {
                this.updateCashPresented(newLine, startDate);
                if ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                {
                    processCashPresented(newLine,tra,startDate);
                    cashProcessed=true;
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    if ((traList.get(indice).getTraType()!=null) && (traList.get(indice).getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    {
                        processCashPresented(newLine,traList.get(indice),startDate);
                        cashProcessed=true;
                    }
                    else
                        cashLine=newLine;
                }
                else
                    cashLine=newLine;
            }
            else if ((newLine.contains("CARD RETAINED BY HOST"))||(newLine.contains("CARD CAPTURED")))
            {
                if ((tra!=null)&&(tra.getTraResponseCode()!=null)&&(tra.getTraResponseCode().length()>0))
                {
                    tra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
                else if (traList.size()>0)
                {
                    int indice = traList.size()-1;
                    BrsTransaction lastTra =traList.get(indice);
                    lastTra.setTraType( TransactionManager.TRANS_TYPE_CAP_CART);
                }
            }
            else if(newLine.contains("-------------------------"))
            {
                // Passer a la ligne suivante
            	String line2="";
                String line3="";
                String line4="";
                String line5="";
                String line6="";
           	
           	try {
                   lastLine++;
                   line2 = this.reader.readLine();if (line2==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                   System.out.println("==>line2="+line2);
                   line3 = this.reader.readLine();if (line3==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                   System.out.println("==>line3="+line3);
                   line4 = this.reader.readLine();if (line4==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                   System.out.println("==>line4="+line4);            
               } catch (IOException ex) {
                   log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                   lastLine=firstLine;
                   return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
               }
           	
              
               //tra.setTraGabId(dbGab.getGabId());
               tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
               tra.setTraRetract(TransactionManager.RETRACT_NOK);
               tra.setTraTraite(TransactionManager.TRANS_TRAITE_INST);
               tra.setTraGabTraite(TransactionManager.ArrGab_TRAITE_INST);
               tra.setTraNote1(0);
               tra.setTraNote2(0);
               tra.setTraNote3(0);
               tra.setTraNote4(0);
               
               newLine=line+" "+line2+" "+line3+" "+line4+" "+line5;
               

               newLine=newLine.toUpperCase();
               // Type transaction
               int type=TransactionManager.TRANS_TYPE_INCONNU;
               if (newLine.contains("CASH WITHRAWAL")){
                   type= TransactionManager.TRANS_TYPE_RETRAIT;
               }
               else if (newLine.contains("BALANCE INQUIRY")){
                   type= TransactionManager.TRANS_TYPE_DEM_SOLDE;
               }
                else if (newLine.contains("MINI RELEVE")){
                   type= TransactionManager.TRANS_TYPE_MIN_REL;
               }
               else if (newLine.contains("AUTHENTIFICATION")){
                   type= TransactionManager.TRANS_TYPE_AUTHEN;
               }
               else if (newLine.contains("CAPTURE DE CARTE")){
                   type= TransactionManager.TRANS_TYPE_CAP_CART;
               }
               else if (newLine.contains("TRANSACTION ANNULEE")){
                   type= TransactionManager.TRANS_TYPE_ANNULLE;

               }
               else
               {
                   log.error("Unknown transaction type===== ("+newLine+") at line :"+firstLine);
                   lastLine=firstLine+1;
                   return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
               }
               tra.setTraType(type);
               if (type!=TransactionManager.TRANS_TYPE_RETRAIT)
                   tra.setTraCashTaken(TransactionManager.CASH_TAKEN_NOK);

           	if(type==TransactionManager.TRANS_TYPE_AUTHEN) {
           		tra.setTraCardNbr(line2.trim());
           		
           		String[] lines=line3.split(" ");
           		String responseCode=lines[lines.length-1];
           		tra.setTraResponseCode(responseCode.replace(":", ""));
           	}
           	
           	if(type==TransactionManager.TRANS_TYPE_DEM_SOLDE) {
           		tra.setTraCardNbr(line2.trim());    		
           		String[] lines=line3.split("[\\s]+");    		
           		
           		String dateString=lines[0]+" "+lines[1];
           		DateFormat dateFormat = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
                   Date evDate=null;
                   try {
                       evDate = dateFormat.parse(dateString);
                       tra.setTraDate(evDate);
                   } catch (ParseException ex) {
                       log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                       ex.printStackTrace();
                   }   
                   
                   try {
                       lastLine++;
                       line5 = this.reader.readLine();if (line5==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
                       System.out.println("==>line5="+line5);                
                   } catch (IOException ex) {
                       log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
                       lastLine=firstLine;
                       return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
                   }
                   tra.setTraAccountNbr(line5.replace("ACCOUNT :", ""));
           	}
           	
           	 if (type==TransactionManager.TRANS_TYPE_RETRAIT) {
           		 String[] lines=line2.split("[\\s]+");
           		 tra.setTraCardNbr(lines[2].replace(":", ""));    		
           		 lines=line3.split("[\\s]+");  
           		 String dateString=lines[0]+" "+lines[1];
            		 DateFormat dateFormat = new SimpleDateFormat("yy/MM/dd HH:mm:ss");
                    Date evDate=null;
                    try {
                        evDate = dateFormat.parse(dateString);
                        tra.setTraDate(evDate);
                    } catch (ParseException ex) {
                        log.error("Incorrect date format :"+dateString+" in file :"+this.getCurrentFile()+" at line No :"+this.lastLine+" first line="+firstLine);
                        ex.printStackTrace();
                    }   
                    tra.setTraRef(Integer.parseInt(lines[2]));
                    lines=line4.split("[\\s]+");
                    tra.setTraMontant(Float.valueOf(lines[1].replace(":", "")));    		
           		 
           		 try {
       	            lastLine++;
       	            line5 = this.reader.readLine();if (line5==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
       	            System.out.println("==>line5="+line5);
       	            line6 = this.reader.readLine();if (line6==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
       	            System.out.println("==>line6="+line6);
       	        } catch (IOException ex) {
       	            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
       	            lastLine=firstLine;
       	            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
       	        }
           		tra.setTraAccountNbr(line6.replace("ACCOUNT :", ""));
           		tra.setTraResponseCode(line5.replace("RESPONSE :", ""));
           		
           		String ligne=lastProcessedLine;
           		int pos=ligne.indexOf("NOTES PRESENTED");
           		if(pos>=0) {
       	    		String note=ligne.substring(pos);
       	        	note=note.replace("NOTES PRESENTED:","");
       	        	lines=note.split(",");
       	    		
       	    		tra.setTraNote1(Integer.parseInt(lines[0]));
       	    		tra.setTraNote2(Integer.parseInt(lines[1]));
       	    		tra.setTraNote3(Integer.parseInt(lines[2]));
       	    		tra.setTraNote4(Integer.parseInt(lines[3]));
           		}
           		
           		String line7="",line8="";
           		try {
       	            lastLine++;
       	            line7 = this.reader.readLine();if (line7==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
       	            System.out.println("==>line7="+line7);
       	            line8 = this.reader.readLine();if (line8==null){lastLine=firstLine;return LogAnalyser.LOG_ANALYSER_END_OF_FILE;}
       	            System.out.println("==>line8="+line8);
       	        } catch (IOException ex) {
       	            log.error("Error reading log file :"+this.getCurrentFile()+" at line :"+this.getLastLine()+1+" with reason :"+ex.getMessage());
       	            lastLine=firstLine;
       	            return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
       	        }
          
           		if(line8.contains("CASH TAKEN"))
           			tra.setTraCashTaken(TransactionManager.CASH_TAKEN_OK);
           		
           	 }
           	System.out.println("=====>Transaction:"+tra);

            }
            else if (containsKeyWord(newLine))
            {
                lineToProcess=newLine;
                newLine="TRANSACTION END";
            }          
        }

        if (newLine.contains("TRANSACTION END"))
        {
            if ((tra!=null) && (tra.getTraResponseCode()!=null) && (tra.getTraResponseCode().length()!=0))
            {
                if (cashLine.length()!=0)
                {
                    if (
                        ((tra.getTraType()!=null) && (tra.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT))
                    &&   ((tra.getTraResponseCode()==null)||(tra.getTraResponseCode().compareTo("000")==0))
                    )
                    {
                        processCashPresented(cashLine,tra,startDate);
                        cashProcessed=true;
                        cashLine="";
                    }
                }
                traList.add(tra);
            }

            // Enregistrer
            Iterator it = traList.iterator();
            while(it.hasNext())
            {               
                BrsTransaction tra1 = (BrsTransaction)it.next();

                if((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&(tra1.getTraResponseCode().compareTo("000")==0)&&(!cashProcessed))
                    estimateNotesPresented(tra1,startDate);

                if(startDate==null)
                    startDate=tra1.getTraDate();
                tra1.setTraInsDate(startDate);

               // if(tra1.getTraRef().intValue()==143342)
                //    System.exit(1);

                TransactionManager.setTraNotifRet4Tra(tra1);
                
                TransactionManager.insert(tra1);
                System.out.println("TransactionManager.insert==================>"+tra1);

                if ((lastEventDate==null) || (tra1.getTraInsDate().after(lastEventDate)))
                {
                    lastEventDate=tra1.getTraInsDate();
                }
                /*if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraDate();    */
                if ((tra1.getTraType()==TransactionManager.TRANS_TYPE_RETRAIT)&&((lastRetraitDate==null) || (tra1.getTraInsDate().after(lastRetraitDate))))
                    lastRetraitDate=tra1.getTraInsDate();
            }

            if (lineToProcess.length()>0)
                return processLine(lineToProcess);

                  if(isForceEnd())
            {
                return LogAnalyser.LOG_ANALYSER_END_OF_FILE;
            }

            return LogAnalyser.LOG_ANALYSER_REFRESH_OK;
        }
        //log.error("'TRANSACTION END' not found at line :"+firstLine);
        lastLine=firstLine+1;
        return LogAnalyser.LOG_ANALYSER_SYSTEM_ERROR;
    }

}
