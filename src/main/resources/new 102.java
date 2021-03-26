package ma.brs2.infrastructure.packager;

import ma.brs2.common.ISOUtil;

/**
 * <p>
 * Classe qui représente la structure D'un Buffer ISO
 * </p>
 * 
 * @author Mustapha RACHID
 * 
 */

public class SIsoMsg extends MsgPackager {

	public boolean isInput;
	public int nLenMsg = -1;
	public int nLenLenHead = 0;
	public int nLenHead = 0;
	public byte[] sHeader = null;
	public SFieldInfo[] tabHeaderField;
	public byte[] sBitMap = null;

	public int getNLenLenHead() {
		return nLenLenHead;
	}

	public void setNLenLenHead(int lenLenHead) {
		nLenLenHead = lenLenHead;
	}

	public byte[] getSBitMap() {
		return sBitMap;
	}

	public void setSBitMap(byte[] bitMap) {
		sBitMap = bitMap;
	}

	public byte[] getSHeader() {
		return sHeader;
	}

	public void setSHeader(byte[] header) {
		sHeader = header;
	}

	public int getNLenMsg() {
		return nLenMsg;
	}

	public void setNLenMsg(int lenMsg) {
		nLenMsg = lenMsg;
	}

	public int getNLenHead() {
		return nLenHead;
	}

	public void setNLenHead(int lenHead) {
		nLenHead = lenHead;
	}
	
	@SuppressWarnings("static-access")
	public void init(int _encode){
			
		for(int i=0;i<PackagerIso.getInstance().getTabPackagerIso().length;i++){
			PackagerIso.getInstance().getTabPackagerIso()[i].setMtiEncode(_encode);
			for(int j=0;j<PackagerIso.getInstance().getTabPackagerIso()[i].getTabFields().length;j++){
				if(PackagerIso.getInstance().getTabPackagerIso()[i].getTabFields()[j]!=null){
					PackagerIso.getInstance().getTabPackagerIso()[i].getTabFields()[j].setLenEncode(_encode);
					PackagerIso.getInstance().getTabPackagerIso()[i].getTabFields()[j].setFieldEncode(_encode);
				}
			}
		}
		
		for(int i=0;i<PackagerTlv.getInstance().getTabPackagerTlvNode().length;i++){
			PackagerTlv.getInstance().getTabPackagerTlvNode()[i].setLenEncode(_encode);
			PackagerTlv.getInstance().getTabPackagerTlvNode()[i].setTagEncode(_encode);
			for(int j=0;j<PackagerTlv.getInstance().getTabPackagerTlvNode()[i].getTTlvFields().length;j++){
				if(PackagerTlv.getInstance().getTabPackagerTlvNode()[i].getTTlvFields()[j]!=null){
					PackagerTlv.getInstance().getTabPackagerTlvNode()[i].getTTlvFields()[j].setValueEncode(_encode);					
				}
			}
		}		
	}

	@SuppressWarnings("static-access")
	public int unpack(int indexPackager, int indexToStart, byte[] szBuffer,
			int nLength) {

		int nBytes;
		byte[] sPtr;
		byte[] szMsgTypeA = new byte[4];
		int indexBuffer = indexToStart;

		this.setIsUsed(M_USED);
		sPtr = szBuffer;

		/***** Header processing ******/

		switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getHeaderType()) {

		case HEADER_NONE:
			this.setNLenHead(0);
			break;

		case HEADER_FIX:
			this.setNLenHead(PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
					.getHeaderLength());

			break;

		case HEADER_VAR:
			this.setNLenHead(ISOUtil.GetLength(sPtr, indexBuffer, PackagerIso
					.getInstance().getTabPackagerIso()[indexPackager]
					.getHeaderLenLength(), PackagerIso.getInstance()
					.getTabPackagerIso()[indexPackager].getHeaderLenEncode()));
			break;
		}
		if (this.getNLenHead() != 0) {
			indexBuffer += PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
					.getHeaderLenLength();
			int indexFile, indexStruct;
			indexFile = FilePackager.GetIndexPackagerByName(PackagerIso
					.getInstance().getTabPackagerIso()[indexPackager]
					.getHeaderDesc());

			switch (FilePackager.getInstance().getTabPackager()[indexFile]
					.getPackagerType()) {
			case ISO_PACKAGER:
				this.headerField = new SIsoMsg();
				indexStruct = SIsoMsg.GetIndexIsoPackagerByName(FilePackager
						.getInstance().getTabPackager()[indexFile]
						.getPackagerTypeName());
				((SIsoMsg) (this.headerField))
						.unpack(indexStruct,
								indexBuffer,
								sPtr,
								this.getNLenHead()
										- PackagerIso.getInstance()
												.getTabPackagerIso()[indexPackager]
												.getIncludedHeaderLen());
				break;

			case STRUCT_PACKAGER:
				this.headerField = new SStructMsg();
				indexStruct = SStructMsg
						.GetIndexStructPackagerByName(FilePackager
								.getInstance().getTabPackager()[indexFile]
								.getPackagerTypeName());
				((SStructMsg) (this.headerField)).unpack(indexStruct,
						indexBuffer, sPtr, this.getNLenHead());
				break;

			case TLV_PACKAGER:
				this.headerField = new STlvMsg();
				indexStruct = STlvMsg.GetIndexTlvPackagerByName(FilePackager
						.getInstance().getTabPackager()[indexFile]
						.getPackagerTypeName());
				((STlvMsg) (this.headerField))
						.unpack(indexStruct,
								indexBuffer,
								sPtr,
								this.getNLenHead()
										- PackagerIso.getInstance()
												.getTabPackagerIso()[indexPackager]
												.getIncludedHeaderLen());
				break;
			}
			indexBuffer = this.getNLenHead();
		}

		/*** Mti Processing ****/

		switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getMtiEncode()) {
		case ENCODE_BCD:
			ISOUtil.bcdToAscii(sPtr, indexBuffer, szMsgTypeA, 4);
			this.setNMsgType(ISOUtil.aToi(szMsgTypeA));
			indexBuffer += 2;
			break;

		case ENCODE_ASCII:
			System.arraycopy(sPtr, indexBuffer, szMsgTypeA, 0, 4);
			this.setNMsgType(ISOUtil.aToi(szMsgTypeA));
			indexBuffer += 4;
			break;

		case ENCODE_EBCDIC:
			szMsgTypeA = ISOUtil.ebcdicToAsciiBytes(sPtr, indexBuffer, 4);
			this.setNMsgType(ISOUtil.aToi(szMsgTypeA));
			indexBuffer += 4;
			break;

		}
		/*** BitMap Processing ***/

		byte[] bM = new byte[16];
		System.arraycopy(sPtr, indexBuffer, bM, 0, 16);

		int iMapCtr = 1;
		while (((bM[(iMapCtr - 1) * 8] & 0x80) == 0x80) && (iMapCtr < 2)) {
			++iMapCtr;
		}

		byte[] bMap = new byte[iMapCtr * 8];
		System.arraycopy(sPtr, indexBuffer, bMap, 0, iMapCtr * 8);
		this.setSBitMap(bMap);
		indexBuffer += iMapCtr * 8;

		tab_fields_info = new SFieldInfo[L_MAP];

		for (int i = 0; i < L_MAP; i++) {
			tab_fields_info[i] = new SFieldInfo();
			tab_fields_info[i].setNLength(0);
			tab_fields_info[i].setIsPresent(F_NOT_PRESENT);
		}
		if (ISOUtil.CheckBit(this.getSBitMap(), 0)) {
			this.getTab_fields_info()[0].setIsPresent(F_PRESENT);
		}
		/*** Data Elements Processing ***/
		for (int i = 1; i < iMapCtr * 64; ++i) {			
			if (ISOUtil.CheckBit(this.getSBitMap(), i)) {
				System.out.print(i+"===indexBuffer="+indexBuffer+"=="+String.format("%1$-46s", PackagerIso.getInstance().getTabPackagerIso()[0].getTabFields()[i].getName()));
				this.getTab_fields_info()[i].setIsPresent(F_PRESENT);
				switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getLengthType()) {

				case LEN_FIX:
					this.getTab_fields_info()[i].setNLength(PackagerIso
							.getInstance().getTabPackagerIso()[indexPackager]
							.getTabFields()[i].getFieldLength());
					break;
				case LEN_L:
				case LEN_LL:
				case LEN_LLL:
					this.getTab_fields_info()[i]
							.setNLength(ISOUtil.GetLength(sPtr, indexBuffer,
									PackagerIso.getInstance()
											.getTabPackagerIso()[indexPackager]
											.getTabFields()[i].getLengthType(),
									PackagerIso.getInstance()
											.getTabPackagerIso()[indexPackager]
											.getTabFields()[i].getLenEncode()));
					break;
				}
				this.getTab_fields_info()[i].setSData(new byte[this
						.getTab_fields_info()[i].getNLength()]);
				indexBuffer += PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getLengthType();
				
				System.out.println(PackagerIso.getInstance().getTabPackagerIso()[indexPackager].getTabFields()[i].getLengthType());
				
				nBytes = this.getTab_fields_info()[i].getNLength();

				switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getFieldType()) {

				case HEX:
					byte[] bHex;
					bHex = new byte[this.getTab_fields_info()[i].getNLength()];
					int ii = ISOUtil.hexToAscii(sPtr, indexBuffer, bHex,
							bHex.length);
					this.getTab_fields_info()[i].setSData(bHex);

					if (this.getTab_fields_info()[i].getNLength() % 2 == 1) {
						nBytes = (this.getTab_fields_info()[i].getNLength() + 1) / 2;
					} else {
						nBytes = (this.getTab_fields_info()[i].getNLength()) / 2;
					}
					break;

				case ALPHA:
					if (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
							.getTabFields()[i].getFieldEncode() == ENCODE_EBCDIC) {
						this.getTab_fields_info()[i].setSData(ISOUtil
								.ebcdicToAsciiBytes(sPtr, indexBuffer, this
										.getTab_fields_info()[i].getNLength()));

					} else {
						byte[] bAlpha = new byte[this.getTab_fields_info()[i]
								.getNLength()];
						

						try {
						System.arraycopy(sPtr, indexBuffer, bAlpha, 0,
								this.getTab_fields_info()[i].getNLength());
						this.getTab_fields_info()[i].setSData(bAlpha);
						}
						catch(Exception e) {
							String nameField = String.format("%1$-46s", PackagerIso.getInstance().getTabPackagerIso()[0].getTabFields()[i].getName());
							System.out.println("nameField="+nameField);
							System.out.println("sPtr="+sPtr.length);
							System.out.println("indexBuffer="+indexBuffer);
							System.out.println("bAlpha="+bAlpha.length);
							
							System.out.println("this.getTab_fields_info()[i].getNLength()="+this.getTab_fields_info()[i].getNLength());
							System.out.println("e="+e.getMessage());
							e.printStackTrace();
						}
					}
					break;

				case BIN:
					byte[] bBin = new byte[this.getTab_fields_info()[i]
							.getNLength()];
					System.arraycopy(sPtr, indexBuffer, bBin, 0,
							this.getTab_fields_info()[i].getNLength());
					this.getTab_fields_info()[i].setSData(bBin);
					break;

				case BCD:
					byte[] bBcd = new byte[this.getTab_fields_info()[i]
							.getNLength()];
					nBytes = ISOUtil.bcdToAscii(sPtr, indexBuffer, bBcd,
							this.getTab_fields_info()[i].getNLength());
					this.getTab_fields_info()[i].setSData(bBcd);
					break;

				case SBCD:
					byte[] bSBcd = new byte[this.getTab_fields_info()[i]
							.getNLength() * 2];
					nBytes = ISOUtil.bcdToAscii(sPtr, indexBuffer, bSBcd,
							this.getTab_fields_info()[i].getNLength() * 2);
					this.getTab_fields_info()[i].setSData(bSBcd);
					break;

				case SHEX:
					// vide
					break;

				case PACKAGED:
					try {
						this.getTab_fields_info()[i]
								.setNIndexPack(FilePackager
										.GetIndexPackagerByName(PackagerIso
												.getInstance()
												.getTabPackagerIso()[indexPackager]
												.getTabFields()[i]
												.getFPackagerName()));
					} catch (Exception e) {
						System.out.println(e.getLocalizedMessage());
						return NOK;

					}
					this.getTab_fields_info()[i].setNPackType(FilePackager
							.getInstance().getTabPackager()[this
							.getTab_fields_info()[i].getNIndexPack()]
							.getPackagerType());
					switch (this.getTab_fields_info()[i].getNPackType()) {
					case ISO_PACKAGER:
						try {
							this.getTab_fields_info()[i]
									.setNIndexPackType(SIsoMsg
											.GetIndexIsoPackagerByName(FilePackager
													.getInstance()
													.getTabPackager()[this
													.getTab_fields_info()[i]
													.getNIndexPack()]
													.getPackagerTypeName()));

						} catch (Exception e) {
							System.out.println(e.getLocalizedMessage());
							return NOK;
						}
						this.getTab_fields_info()[i].SubInfo = new SIsoMsg();
						((SIsoMsg) (this.getTab_fields_info()[i].SubInfo))
								.unpack(this.getTab_fields_info()[i]
										.getNIndexPackType(), indexBuffer,
										sPtr, this.getTab_fields_info()[i]
												.getNLength());
						break;

					case TLV_PACKAGER:
						try {
							this.getTab_fields_info()[i]
									.setNIndexPackType(STlvMsg
											.GetIndexTlvPackagerByName(FilePackager
													.getInstance()
													.getTabPackager()[this
													.getTab_fields_info()[i]
													.getNIndexPack()]
													.getPackagerTypeName()));

						} catch (Exception e) {
							System.out.println(e.getLocalizedMessage());
							return NOK;
						}
						this.getTab_fields_info()[i].SubInfo = new STlvMsg();
						((STlvMsg) this.getTab_fields_info()[i].SubInfo)
								.unpack(this.getTab_fields_info()[i]
										.getNIndexPackType(), indexBuffer,
										sPtr, this.getTab_fields_info()[i]
												.getNLength());

						break;
					case STRUCT_PACKAGER:
						try {
							this.getTab_fields_info()[i]
									.setNIndexPackType(SStructMsg
											.GetIndexStructPackagerByName(FilePackager
													.getInstance()
													.getTabPackager()[this
													.getTab_fields_info()[i]
													.getNIndexPack()]
													.getPackagerTypeName()));

						} catch (Exception e) {
							System.out.println(e.getLocalizedMessage());
							return NOK;
						}
						this.getTab_fields_info()[i].SubInfo = new SStructMsg();
						((SStructMsg) (this.getTab_fields_info()[i].SubInfo))
								.unpack(this.getTab_fields_info()[i]
										.getNIndexPackType(), indexBuffer,
										sPtr, this.getTab_fields_info()[i]
												.getNLength());

						break;
					case BER_PACKAGER:
						try {
							this.getTab_fields_info()[i]
									.setNIndexPackType(SBerMsg
											.GetIndexBerPackagerByName(FilePackager
													.getInstance()
													.getTabPackager()[this
													.getTab_fields_info()[i]
													.getNIndexPack()]
													.getPackagerTypeName()));

						} catch (Exception e) {
							System.out.println(e.getLocalizedMessage());
							return NOK;
						}
						this.getTab_fields_info()[i].SubInfo = new SBerMsg();
						((SBerMsg) (this.getTab_fields_info()[i].SubInfo))
								.unpack(this.getTab_fields_info()[i]
										.getNIndexPackType(), indexBuffer,
										sPtr, this.getTab_fields_info()[i]
												.getNLength());

						break;
					case SWITCH_PACKAGER:
						int szBaseValue;
						if ((this.getTab_fields_info()[i].nIndexPackType = SSwitchMsg
								.GetIndexSwitchPackagerByName(FilePackager
										.getInstance().getTabPackager()[this
										.getTab_fields_info()[i].nIndexPack]
										.getPackagerTypeName())) < 0) {
							return (NOK);
						}
						if (PackagerSwitch.getInstance()
								.getTPackagerSwitchNode()[this
								.getTab_fields_info()[i].nIndexPackType]
								.getFieldBaseId() == 0) {
							szBaseValue = (this.nMsgType);

						} else {
							byte[] buffer = new byte[256];
							buffer = this
									.GetField(
											nIndexPackager,
											PackagerSwitch.getInstance()
													.getTPackagerSwitchNode()[this
													.getTab_fields_info()[i].nIndexPackType]
													.getFieldBaseId());
							szBaseValue = Integer.parseInt(buffer.toString());
						}
						this.getTab_fields_info()[i].SubInfo = new SSwitchMsg();
						((SSwitchMsg) (this.getTab_fields_info()[i].SubInfo))
								.unpack(this.getTab_fields_info()[i].nIndexPackType,
										szBaseValue, indexBuffer, sPtr, nlength);
						break;
					default:
						return (NOK);
					}

				}
				indexBuffer += nBytes;
			}

		}
		if (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getMsgId() == 0) {
			this.setMsgId(String.valueOf(this.getNMsgType()));
		} else {
			this.setMsgId(new String(this.getTab_fields_info()[PackagerIso
					.getInstance().getTabPackagerIso()[indexPackager]
					.getMsgId()].sData));
		}
		return OK;
	}

	public byte[] pack(int indexPackager) {

		int indexBuffer = 0;
		int nBytes;
		int iMapCtr;
		byte[] szMsgTypeA = new byte[4];
		byte[] sPtr = new byte[LG_MAX];
		nBytes = 0;

		/***** Header processing ******/

		switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getHeaderType()) {

		case HEADER_NONE:
			break;

		case HEADER_FIX:
			break;

		case HEADER_VAR:
			ISOUtil.PutLength(
					sPtr,
					indexBuffer,
					this.getNLenHead(),
					PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
							.getHeaderLenLength(), PackagerIso.getInstance()
							.getTabPackagerIso()[indexPackager]
							.getHeaderLenEncode());
			break;
		}
		if (this.getNLenHead() != 0) {
			indexBuffer += PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
					.getHeaderLenLength();
			int indexFile, indexStruct;
			indexFile = FilePackager.GetIndexPackagerByName(PackagerIso
					.getInstance().getTabPackagerIso()[indexPackager]
					.getHeaderDesc());
			this.sData = new byte[LG_MAX];
			switch (FilePackager.getInstance().getTabPackager()[indexFile]
					.getPackagerType()) {
			case ISO_PACKAGER:
				this.headerField = new SIsoMsg();
				indexStruct = SIsoMsg.GetIndexIsoPackagerByName(FilePackager
						.getInstance().getTabPackager()[indexFile]
						.getPackagerTypeName());
				this.sData = ((SIsoMsg) (this.headerField)).pack(indexStruct);
				break;

			case STRUCT_PACKAGER:
				indexStruct = SStructMsg
						.GetIndexStructPackagerByName(FilePackager
								.getInstance().getTabPackager()[indexFile]
								.getPackagerTypeName());
				this.sData = ((SStructMsg) (this.headerField))
						.pack(indexStruct);
				break;

			case TLV_PACKAGER:
				this.headerField = new STlvMsg();
				indexStruct = STlvMsg.GetIndexTlvPackagerByName(FilePackager
						.getInstance().getTabPackager()[indexFile]
						.getPackagerTypeName());
				this.sData = ((STlvMsg) (this.headerField)).pack(indexStruct);
				break;
				
			case BER_PACKAGER:
				this.headerField = new SBerMsg();
				indexStruct = SBerMsg.GetIndexBerPackagerByName(FilePackager
						.getInstance().getTabPackager()[indexFile]
						.getPackagerTypeName());
				this.sData = ((SBerMsg) (this.headerField)).pack(indexStruct);
				break;
			}
			System.arraycopy(this.sData, 0, sPtr, indexBuffer,
					this.sData.length);
			indexBuffer = this.getNLenHead();
		}

		/*** MTI Management ***/

		System.arraycopy(ISOUtil.intToByteArray(this.getNMsgType()), 0,
				szMsgTypeA, 0, 4);
		switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getMtiEncode()) {
		case ENCODE_BCD:
			byte[] sDst = new byte[2];
			ISOUtil.AsciiToBcd(szMsgTypeA, sDst, 4);
			System.arraycopy(sDst, 0, sPtr, indexBuffer, sDst.length);
			indexBuffer += 2;

			break;

		case ENCODE_ASCII:
			System.arraycopy(szMsgTypeA, indexBuffer, sPtr, 0, 4);
			indexBuffer += 4;

			break;

		case ENCODE_EBCDIC:
			System.arraycopy(ISOUtil.asciiToEbcdic(szMsgTypeA), 0, sPtr,
					indexBuffer, 4);
			indexBuffer += 4;

			break;
		}
		/*** BitMap Management ***/
		this.sBitMap = new byte[PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getBitmaplen()];
		for (int i=0;i<PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getBitmaplen(); i++){
			this.sBitMap[i] = (byte) 0x00;
		}
		for (int i = 1; i < PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
				.getTabFields().length; i++) {
			if (this.getTab_fields_info()[i].getIsPresent() == F_PRESENT) {
				ISOUtil.bitSet(this.sBitMap, i + 1);
				if (i>64)
					this.getTab_fields_info()[0].setIsPresent(F_PRESENT);
			}
		}
		if (this.getTab_fields_info()[0].getIsPresent() == F_PRESENT) {
			ISOUtil.bitSet(this.sBitMap, 1);
		}

		iMapCtr = 1;
		while (((this.sBitMap[(iMapCtr - 1) * 8] & 0x80) == 0x80)
				&& (iMapCtr < 2)) {
			++iMapCtr;
		}

		nBytes += iMapCtr * 8;
		System.arraycopy(this.sBitMap, 0, sPtr, indexBuffer, iMapCtr * 8);
		indexBuffer += iMapCtr * 8;

		/**** Data Elements ***/

		for (int i = 1; i < L_MAP; i++) {

			if (this.getTab_fields_info()[i].getIsPresent() == F_PRESENT) {

				if (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getFieldType() == PACKAGED) {
					this.getTab_fields_info()[i].sData = new byte[LG_MAX];
					switch (this.getTab_fields_info()[i].getNPackType()) {
					case ISO_PACKAGER:
						this.getTab_fields_info()[i].sData = ((SIsoMsg) (this
								.getTab_fields_info()[i].SubInfo)).pack(this
								.getTab_fields_info()[i].nIndexPackType);
						this.getTab_fields_info()[i].nLength =this.getTab_fields_info()[i].sData.length; 
						break;
					case TLV_PACKAGER:
						this.getTab_fields_info()[i].sData = ((STlvMsg) (this
								.getTab_fields_info()[i].SubInfo)).pack(this
								.getTab_fields_info()[i].nIndexPackType);
						this.getTab_fields_info()[i].nLength =this.getTab_fields_info()[i].sData.length; 
						break;
					case BER_PACKAGER:
						this.getTab_fields_info()[i].sData = ((SBerMsg) (this
								.getTab_fields_info()[i].SubInfo)).pack(this
								.getTab_fields_info()[i].nIndexPackType);
						this.getTab_fields_info()[i].nLength =this.getTab_fields_info()[i].sData.length;
						break;
					case STRUCT_PACKAGER:
						this.getTab_fields_info()[i].sData = ((SStructMsg) (this
								.getTab_fields_info()[i].SubInfo)).pack(this
								.getTab_fields_info()[i].nIndexPackType);
						this.getTab_fields_info()[i].nLength =this.getTab_fields_info()[i].sData.length; 
						break;
					case SWITCH_PACKAGER:
						this.getTab_fields_info()[i].sData = ((SSwitchMsg) (this
								.getTab_fields_info()[i].SubInfo)).pack(this
								.getTab_fields_info()[i].nIndexPackType);
						this.getTab_fields_info()[i].nLength =this.getTab_fields_info()[i].sData.length; 
						break;

					}

				}

				switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getLengthType()) {
				case LEN_FIX:

					break;

				case LEN_L:
				case LEN_LL:
				case LEN_LLL:
					ISOUtil.PutLength(sPtr, indexBuffer, this
							.getTab_fields_info()[i].getNLength(), PackagerIso
							.getInstance().getTabPackagerIso()[indexPackager]
							.getTabFields()[i].getLengthType(), PackagerIso
							.getInstance().getTabPackagerIso()[indexPackager]
							.getTabFields()[i].getLenEncode());

					break;
				}

				indexBuffer += PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getLengthType();
				nBytes = this.getTab_fields_info()[i].getNLength();

				switch (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
						.getTabFields()[i].getFieldType()) {
				case HEX:
					int sHex;
					if (this.getTab_fields_info()[i].getNLength() % 2 == 1) {
						sHex = (this.getTab_fields_info()[i].getNLength() + 1);
					} else {
						sHex = this.getTab_fields_info()[i].getNLength();
					}
					ISOUtil.asciiToHex(this.getTab_fields_info()[i].sData,
							sPtr, indexBuffer,
							this.getTab_fields_info()[i].getNLength());
					nBytes = sHex / 2;
					break;

				case BCD:
					byte[] sDst;
					if (this.getTab_fields_info()[i].getNLength() % 2 == 1) {
						sDst = new byte[(this.getTab_fields_info()[i]
								.getNLength() + 1) / 2];
					} else {
						sDst = new byte[this.getTab_fields_info()[i]
								.getNLength() / 2];
					}

					ISOUtil.AsciiToBcd(this.getTab_fields_info()[i].sData,
							sDst, this.getTab_fields_info()[i].getNLength());
					System.arraycopy(sDst, 0, sPtr, indexBuffer, sDst.length);
					nBytes = sDst.length;

					break;

				case SBCD:
					byte[] Dst;
					if (this.getTab_fields_info()[i].getNLength() % 2 == 1) {
						Dst = new byte[(this.getTab_fields_info()[i]
								.getNLength() + 1) / 2];
					} else {
						Dst = new byte[this.getTab_fields_info()[i]
								.getNLength() / 2];
					}
					ISOUtil.AsciiToBcd(this.getTab_fields_info()[i].sData, Dst,
							this.getTab_fields_info()[i].getNLength() * 2);
					System.arraycopy(Dst, 0, sPtr, indexBuffer,
							this.getTab_fields_info()[i].getNLength());
					nBytes = this.getTab_fields_info()[i].getNLength();
					break;

				case SHEX:
					break;

				case ALPHA:
					if (PackagerIso.getInstance().getTabPackagerIso()[indexPackager]
							.getTabFields()[i].getFieldEncode() == ENCODE_EBCDIC) {
						System.arraycopy(ISOUtil.asciiToEbcdic(this
								.getTab_fields_info()[i].getSData()), 0, sPtr,
								indexBuffer, this.getTab_fields_info()[i]
										.getNLength());
					} else {
						System.arraycopy(
								this.getTab_fields_info()[i].getSData(), 0,
								sPtr, indexBuffer,
								this.getTab_fields_info()[i].getNLength());
					}
					break;

				case BIN:
					System.arraycopy(this.getTab_fields_info()[i].getSData(),
							0, sPtr, indexBuffer,
							this.getTab_fields_info()[i].getNLength());
					break;

				case PACKAGED:

					System.arraycopy(this.getTab_fields_info()[i].sData, 0,
							sPtr, indexBuffer,
							this.getTab_fields_info()[i].getNLength());
					break;
				}
				indexBuffer += nBytes;
			}
		}

		this.sData = sPtr;
		byte[] retour = new byte[indexBuffer];
		System.arraycopy(sPtr, 0, retour, 0, indexBuffer);
		return retour;

	}

	public int AddField(int nIndexPackager, int nField, byte[] szBuffer,
			int nLength) {

		int i;
		if ((nField < 1)
				|| (nField > PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
						.getTabFields().length)) {
			return (NOK);
		}
		if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
				.getTabFields()[nField - 1].getLengthType() == LEN_FIX) {
			if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
					.getTabFields()[nField - 1].getFieldType() != PACKAGED) {
				if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
						.getTabFields()[nField - 1].getFieldLength() != nLength) {
					return (NOK);
				}
			}
		}

		if (this.isUsed != M_USED) {

			this.tab_fields_info = new SFieldInfo[PackagerIso.getInstance()
					.getTabPackagerIso()[nIndexPackager].getTabFields().length];

			for (i = 0; i < PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
					.getTabFields().length; i++) {
				this.tab_fields_info[i] = new SFieldInfo();
				this.getTab_fields_info()[i].setNLength(0);
				this.getTab_fields_info()[i].setIsPresent(F_NOT_PRESENT);
			}
			this.sBitMap = new byte[PackagerIso.getInstance()
					.getTabPackagerIso()[nIndexPackager].getBitmaplen()];
			this.setIsUsed(M_USED);
		}

		if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
				.getTabFields()[nField - 1].getFieldType() == PACKAGED) {
			if ((this.getTab_fields_info()[nField - 1].nIndexPack = FilePackager
					.GetIndexPackagerByName(PackagerIso.getInstance()
							.getTabPackagerIso()[nIndexPackager].getTabFields()[nField - 1]
							.getFPackagerName())) < 0) {
				return (NOK);
			}
			this.getTab_fields_info()[nField - 1].nPackType = FilePackager
					.getInstance().getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
					.getPackagerType();
			switch (this.getTab_fields_info()[nField - 1].nPackType) {
			case ISO_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SIsoMsg
						.GetIndexIsoPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SIsoMsg();
				return ((SIsoMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
						.unpack(nIndexPackager, 0, szBuffer, nLength);

			case TLV_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SIsoMsg
						.GetIndexIsoPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SIsoMsg();
				return ((STlvMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
						.unpack(nIndexPackager, 0, szBuffer, nLength);

			case BER_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SBerMsg
						.GetIndexBerPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SBerMsg();
				return ((SBerMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
						.unpack(nIndexPackager, 0, szBuffer, nLength);
			case STRUCT_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SStructMsg
						.GetIndexStructPackagerByName(FilePackager
								.getInstance().getTabPackager()[this
								.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SStructMsg();
				return ((SStructMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
						.unpack(nIndexPackager, 0, szBuffer, nLength);

			case SWITCH_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SSwitchMsg
						.GetIndexSwitchPackagerByName(FilePackager
								.getInstance().getTabPackager()[this
								.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				byte[] szBaseValue = null;
				if (PackagerSwitch.getInstance().getTPackagerSwitchNode()[this
						.getTab_fields_info()[nField - 1].nIndexPackType]
						.getFieldBaseId() == 0) {

				} else {
					szBaseValue = GetField(
							nIndexPackager,
							PackagerSwitch.getInstance()
									.getTPackagerSwitchNode()[this
									.getTab_fields_info()[nField - 1].nIndexPackType]
									.getFieldBaseId());
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SSwitchMsg();
				return ((SSwitchMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
						.unpack(nIndexPackager,
								Integer.parseInt(new String(szBaseValue)), 0,
								szBuffer, nLength);

			}

		} else {
			this.getTab_fields_info()[nField - 1].sData = new byte[nLength];
			if (this.getTab_fields_info()[nField - 1].sData == null) {
				return (NOK);
			}
			System.arraycopy(szBuffer, 0,
					this.getTab_fields_info()[nField - 1].sData, 0, nLength);
		}

		this.getTab_fields_info()[nField - 1].setIsPresent(F_PRESENT);
		this.getTab_fields_info()[nField - 1].setNLength(nLength);
		return (OK);
	}
	
	public boolean isFieldPresent(int nField){
		if ((nField >= 1) && (nField <= L_MAP)) {
			if (this.getTab_fields_info()[nField - 1].getIsPresent() == F_PRESENT) {
				return (true);
			}
		}
		return false;
	}

	public byte[] GetField(int nIndexPackager, int nField) {

		byte[] szBuffer = null;

		if ((nField >= 1) && (nField <= L_MAP)) {
			if (this.getTab_fields_info()[nField - 1].getIsPresent() != F_PRESENT) {
				return (null);
			}

			if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
					.getTabFields()[nField - 1].getFieldType() == PACKAGED) {
				switch (this.getTab_fields_info()[nField - 1]
						.getNIndexPackType()) {

				case ISO_PACKAGER:
					this.getTab_fields_info()[nField - 1].SubInfo = new SIsoMsg();
					return (((SIsoMsg) this.getTab_fields_info()[nField - 1].SubInfo)
							.pack(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType()));

				case BER_PACKAGER:
					this.getTab_fields_info()[nField - 1].SubInfo = new SBerMsg();
					return (((SBerMsg) this.getTab_fields_info()[nField - 1].SubInfo)
							.pack(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType()));

				case TLV_PACKAGER:
					this.getTab_fields_info()[nField - 1].SubInfo = new STlvMsg();
					return (((STlvMsg) this.getTab_fields_info()[nField - 1].SubInfo)
							.pack(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType()));

				case STRUCT_PACKAGER:
					this.getTab_fields_info()[nField - 1].SubInfo = new SStructMsg();
					return (((SStructMsg) this.getTab_fields_info()[nField - 1].SubInfo)
							.pack(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType()));

				case SWITCH_PACKAGER:
					this.getTab_fields_info()[nField - 1].SubInfo = new SSwitchMsg();
					return (((SSwitchMsg) this.getTab_fields_info()[nField - 1].SubInfo)
							.pack(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType()));
				}
			} else {
				szBuffer = new byte[this.getTab_fields_info()[nField - 1]
						.getNLength()];
				System.arraycopy(this.getTab_fields_info()[nField - 1].sData,
						0, szBuffer, 0,
						this.getTab_fields_info()[nField - 1].getNLength());
				return (szBuffer);
			}

		}
		return szBuffer;
	}

	public static int GetIndexIsoPackagerByName(String packager_name) {
		int i;

		for (i = 0; i < PackagerIso.getInstance().getTabPackagerIso().length; i++) {
			if (PackagerIso.getInstance().getTabPackagerIso()[i].getName()
					.equals(packager_name))
				break;
		}

		if (i >= PackagerIso.getInstance().getTabPackagerIso().length)
			return (NOK);

		return (i);
	}

	public int RemoveField(int nIndexPackager, int nField) {

		if ((nField < 1) || (nField > L_MAP)) {
			return (NOK);
		}

		if (this.isUsed != M_USED) {
			return (NOK);
		}

		if (this.getTab_fields_info()[nField - 1].isPresent == F_PRESENT) {
			if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
					.getTabFields()[nField - 1].getFieldType() == PACKAGED) {
				switch (this.getTab_fields_info()[nField - 1]
						.getNIndexPackType()) {

				}
			} else {
				this.getTab_fields_info()[nField - 1].setNLength(0);
				this.getTab_fields_info()[nField - 1].sData = null;

			}

			this.getTab_fields_info()[nField - 1].isPresent = F_NOT_PRESENT;
		}

		return OK;

	}

	@Override
	public int AddSubField(int nIndexPackager, int nField, int nSubField,
			byte[] szBuffer, int length) {
		int i;
		byte[] szBaseValue = null;
		if ((nField < 1) || (nField > L_MAP)) {
			return (NOK);
		}
		if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
				.getTabFields()[nField - 1].getFieldType() != PACKAGED) {
			return (NOK);
		}
		if (this.isUsed != M_USED) {
			this.tab_fields_info = new SFieldInfo[PackagerIso.getInstance()
					.getTabPackagerIso()[nIndexPackager].getTabFields().length];
			for (i = 0; i < PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
					.getTabFields().length; i++) {
				this.tab_fields_info[i] = new SFieldInfo();
				this.getTab_fields_info()[i].setNLength(0);
				this.getTab_fields_info()[i].setIsPresent(F_NOT_PRESENT);
			}
			this.setIsUsed(M_USED);
		}
		if (this.getTab_fields_info()[nField - 1].isPresent == F_NOT_PRESENT) {
			if ((this.getTab_fields_info()[nField - 1].nIndexPack = FilePackager
					.GetIndexPackagerByName(PackagerIso.getInstance()
							.getTabPackagerIso()[nIndexPackager].getTabFields()[nField - 1]
							.getFPackagerName())) < 0) {
				return (NOK);
			}
			this.getTab_fields_info()[nField - 1].nPackType = FilePackager
					.getInstance().getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
					.getPackagerType();
			switch (this.getTab_fields_info()[nField - 1].nPackType) {
			case ISO_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SIsoMsg
						.GetIndexIsoPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SIsoMsg();
				this.getTab_fields_info()[nField - 1].isPresent = F_PRESENT;
				break;

			case TLV_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = STlvMsg
						.GetIndexTlvPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new STlvMsg();
				this.getTab_fields_info()[nField - 1].isPresent = F_PRESENT;
				break;

			case BER_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SBerMsg
						.GetIndexBerPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SBerMsg();
				this.getTab_fields_info()[nField - 1].isPresent = F_PRESENT;
				break;

			case STRUCT_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = STlvMsg
						.GetIndexTlvPackagerByName(FilePackager.getInstance()
								.getTabPackager()[this.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SStructMsg();
				this.getTab_fields_info()[nField - 1].isPresent = F_PRESENT;
				break;
			case SWITCH_PACKAGER:
				if ((this.getTab_fields_info()[nField - 1].nIndexPackType = SStructMsg
						.GetIndexStructPackagerByName(FilePackager
								.getInstance().getTabPackager()[this
								.getTab_fields_info()[nField - 1].nIndexPack]
								.getPackagerTypeName())) < 0) {
					return (NOK);
				}

				if (PackagerSwitch.getInstance().getTPackagerSwitchNode()[this
						.getTab_fields_info()[nField - 1].nIndexPackType]
						.getFieldBaseId() == 0) {

				} else {
					szBaseValue = GetField(
							nIndexPackager,
							PackagerSwitch.getInstance()
									.getTPackagerSwitchNode()[this
									.getTab_fields_info()[nField - 1].nIndexPackType]
									.getFieldBaseId());
				}
				this.getTab_fields_info()[nField - 1].SubInfo = new SSwitchMsg();
				this.getTab_fields_info()[nField - 1].isPresent = F_PRESENT;
				break;

			}
		}
		switch (this.getTab_fields_info()[nField - 1].nPackType) {
		case ISO_PACKAGER:
			return ((SIsoMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
					.AddField(
							this.getTab_fields_info()[nField - 1].nIndexPackType,
							nSubField, szBuffer, length);
		case TLV_PACKAGER:
			return ((STlvMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
					.AddField(
							this.getTab_fields_info()[nField - 1].nIndexPackType,
							nSubField, szBuffer, length);
		case BER_PACKAGER:
			return ((SBerMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
					.AddField(
							this.getTab_fields_info()[nField - 1].nIndexPackType,
							nSubField, szBuffer, length);
		case STRUCT_PACKAGER:
			return ((SStructMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
					.AddField(
							this.getTab_fields_info()[nField - 1].nIndexPackType,
							nSubField, szBuffer, length);
		case SWITCH_PACKAGER:
			return ((SSwitchMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
					.AddField(
							this.getTab_fields_info()[nField - 1].nIndexPackType,
							Integer.parseInt(new String(szBaseValue)),
							nSubField, szBuffer, length);

		}

		return OK;
	}

	@Override
	public byte[] GetSubField(int nIndexPackager, int nField, int nSubField) {

		if (this.isUsed != M_USED) {
			return (null);
		}
		if ((nField >= 1) && (nField <= L_MAP)) {
			if (this.getTab_fields_info()[nField - 1].isPresent != F_PRESENT) {
				return null;
			}
			if (PackagerIso.getInstance().getTabPackagerIso()[nIndexPackager]
					.getTabFields()[nField - 1].getFieldType() == PACKAGED) {
				switch (this.getTab_fields_info()[nField - 1].nPackType) {
				case ISO_PACKAGER:
					return ((SIsoMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
							.GetField(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType(), nSubField);

				case BER_PACKAGER:
					return ((SBerMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
							.GetField(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType(), nSubField);

				case TLV_PACKAGER:
					return ((STlvMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
							.GetField(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType(), nSubField);

				case STRUCT_PACKAGER:
					return ((SStructMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
							.GetField(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType(), nSubField);

				case SWITCH_PACKAGER:
					return ((SSwitchMsg) (this.getTab_fields_info()[nField - 1].SubInfo))
							.GetField(this.getTab_fields_info()[nField - 1]
									.getNIndexPackType(), nSubField);

				}
			} else
				return (null);
		}

		return (null);
	}

	@Override
	public int RemoveSubField(int indexPackager, int field, int subField) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int unpack(int indexPackager, int szBaseValue, int indexToStart,
			byte[] szBuffer, int length) {
		// TODO Auto-generated method stub
		return 0;
	}

	public int InitProcessSwitchPackagers() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int AddField(int indexPackager, int szBaseValue, int field,
			byte[] szBuffer, int length) {
		// TODO Auto-generated method stub
		return 0;
	}

}
