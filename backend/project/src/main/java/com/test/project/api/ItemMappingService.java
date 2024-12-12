package com.test.project.api;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;



@Service
public class ItemMappingService {

    private final Map<String, ItemMapping> itemMappings = new HashMap<>();

    @jakarta.annotation.PostConstruct // javax.annotation.PostConstruct 사용
    public void initMappings() {
    	itemMappings.put("쌀", new ItemMapping("100", "111", "01"));
    	itemMappings.put("쌀", new ItemMapping("100", "111", "05"));
    	itemMappings.put("쌀", new ItemMapping("100", "111", "10"));
    	itemMappings.put("쌀", new ItemMapping("100", "111", "11"));
    	itemMappings.put("찹쌀", new ItemMapping("100", "112", "01"));
    	itemMappings.put("콩", new ItemMapping("100", "141", "01"));
    	itemMappings.put("콩", new ItemMapping("100", "141", "02"));
    	itemMappings.put("콩", new ItemMapping("100", "141", "03"));
    	itemMappings.put("팥", new ItemMapping("100", "142", "00"));
    	itemMappings.put("팥", new ItemMapping("100", "142", "01"));
    	itemMappings.put("녹두", new ItemMapping("100", "143", "00"));
    	itemMappings.put("녹두", new ItemMapping("100", "143", "01"));
    	itemMappings.put("메밀", new ItemMapping("100", "144", "01"));
    	itemMappings.put("고구마", new ItemMapping("100", "151", "00"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "00"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "01"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "02"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "03"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "04"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "05"));
    	itemMappings.put("감자", new ItemMapping("100", "152", "06"));
    	itemMappings.put("배추", new ItemMapping("200", "211", "01"));
    	itemMappings.put("배추", new ItemMapping("200", "211", "02"));
    	itemMappings.put("배추", new ItemMapping("200", "211", "03"));
    	itemMappings.put("배추", new ItemMapping("200", "211", "06"));
    	itemMappings.put("양배추", new ItemMapping("200", "212", "00"));
    	itemMappings.put("시금치", new ItemMapping("200", "213", "00"));
    	itemMappings.put("상추", new ItemMapping("200", "214", "01"));
    	itemMappings.put("상추", new ItemMapping("200", "214", "02"));
    	itemMappings.put("얼갈이배추", new ItemMapping("200", "215", "00"));
    	itemMappings.put("갓", new ItemMapping("200", "216", "00"));
    	itemMappings.put("수박", new ItemMapping("200", "221", "00"));
    	itemMappings.put("참외", new ItemMapping("200", "222", "00"));
    	itemMappings.put("오이", new ItemMapping("200", "223", "01"));
    	itemMappings.put("오이", new ItemMapping("200", "223", "02"));
    	itemMappings.put("오이", new ItemMapping("200", "223", "03"));
    	itemMappings.put("호박", new ItemMapping("200", "224", "01"));
    	itemMappings.put("호박", new ItemMapping("200", "224", "02"));
    	itemMappings.put("토마토", new ItemMapping("200", "225", "00"));
    	itemMappings.put("딸기", new ItemMapping("200", "226", "00"));
    	itemMappings.put("무", new ItemMapping("200", "231", "01"));
    	itemMappings.put("무", new ItemMapping("200", "231", "02"));
    	itemMappings.put("무", new ItemMapping("200", "231", "03"));
    	itemMappings.put("무", new ItemMapping("200", "231", "06"));
    	itemMappings.put("당근", new ItemMapping("200", "232", "00"));
    	itemMappings.put("당근", new ItemMapping("200", "232", "01"));
    	itemMappings.put("당근", new ItemMapping("200", "232", "02"));
    	itemMappings.put("당근", new ItemMapping("200", "232", "10"));
    	itemMappings.put("열무", new ItemMapping("200", "233", "00"));
    	itemMappings.put("건고추", new ItemMapping("200", "241", "00"));
    	itemMappings.put("건고추", new ItemMapping("200", "241", "01"));
    	itemMappings.put("건고추", new ItemMapping("200", "241", "02"));
    	itemMappings.put("건고추", new ItemMapping("200", "241", "03"));
    	itemMappings.put("건고추", new ItemMapping("200", "241", "10"));
    	itemMappings.put("풋고추", new ItemMapping("200", "242", "00"));
    	itemMappings.put("풋고추", new ItemMapping("200", "242", "02"));
    	itemMappings.put("풋고추", new ItemMapping("200", "242", "03"));
    	itemMappings.put("풋고추", new ItemMapping("200", "242", "04"));
    	itemMappings.put("붉은고추", new ItemMapping("200", "243", "00"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "01"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "02"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "03"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "04"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "06"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "07"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "08"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "21"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "22"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "23"));
    	itemMappings.put("피마늘", new ItemMapping("200", "244", "24"));
    	itemMappings.put("양파", new ItemMapping("200", "245", "00"));
    	itemMappings.put("양파", new ItemMapping("200", "245", "02"));
    	itemMappings.put("양파", new ItemMapping("200", "245", "10"));
    	itemMappings.put("파", new ItemMapping("200", "246", "00"));
    	itemMappings.put("파", new ItemMapping("200", "246", "02"));
    	itemMappings.put("생강", new ItemMapping("200", "247", "00"));
    	itemMappings.put("생강", new ItemMapping("200", "247", "01"));
    	itemMappings.put("고춧가루", new ItemMapping("200", "248", "00"));
    	itemMappings.put("고춧가루", new ItemMapping("200", "248", "01"));
    	itemMappings.put("가지", new ItemMapping("200", "251", "00"));
    	itemMappings.put("미나리", new ItemMapping("200", "252", "00"));
    	itemMappings.put("깻잎", new ItemMapping("200", "253", "00"));
    	itemMappings.put("부추", new ItemMapping("200", "254", "00"));
    	itemMappings.put("피망", new ItemMapping("200", "255", "00"));
    	itemMappings.put("파프리카", new ItemMapping("200", "256", "00"));
    	itemMappings.put("멜론", new ItemMapping("200", "257", "00"));
    	itemMappings.put("깐마늘(국산)", new ItemMapping("200", "258", "01"));
    	itemMappings.put("깐마늘(국산)", new ItemMapping("200", "258", "03"));
    	itemMappings.put("깐마늘(국산)", new ItemMapping("200", "258", "04"));
    	itemMappings.put("깐마늘(국산)", new ItemMapping("200", "258", "05"));
    	itemMappings.put("깐마늘(국산)", new ItemMapping("200", "258", "06"));
    	itemMappings.put("깐마늘(수입)", new ItemMapping("200", "259", "01"));
    	itemMappings.put("깐마늘(수입)", new ItemMapping("200", "259", "03"));
    	itemMappings.put("절임배추", new ItemMapping("200", "266", "01"));
    	itemMappings.put("절임배추", new ItemMapping("200", "266", "02"));
    	itemMappings.put("절임배추", new ItemMapping("200", "266", "03"));
    	itemMappings.put("절임배추", new ItemMapping("200", "266", "04"));
    	itemMappings.put("알배기배추", new ItemMapping("200", "279", "00"));
    	itemMappings.put("브로콜리", new ItemMapping("200", "280", "00"));
    	itemMappings.put("방울토마토", new ItemMapping("200", "422", "01"));
    	itemMappings.put("방울토마토", new ItemMapping("200", "422", "02"));
    	itemMappings.put("참깨", new ItemMapping("300", "312", "01"));
    	itemMappings.put("참깨", new ItemMapping("300", "312", "02"));
    	itemMappings.put("참깨", new ItemMapping("300", "312", "03"));
    	itemMappings.put("들깨", new ItemMapping("300", "313", "01"));
    	itemMappings.put("들깨", new ItemMapping("300", "313", "02"));
    	itemMappings.put("땅콩", new ItemMapping("300", "314", "01"));
    	itemMappings.put("땅콩", new ItemMapping("300", "314", "02"));
    	itemMappings.put("느타리버섯", new ItemMapping("300", "315", "00"));
    	itemMappings.put("느타리버섯", new ItemMapping("300", "315", "01"));
    	itemMappings.put("팽이버섯", new ItemMapping("300", "316", "00"));
    	itemMappings.put("새송이버섯", new ItemMapping("300", "317", "00"));
    	itemMappings.put("호두", new ItemMapping("300", "318", "00"));
    	itemMappings.put("아몬드", new ItemMapping("300", "319", "00"));
    	itemMappings.put("사과", new ItemMapping("400", "411", "01"));
    	itemMappings.put("사과", new ItemMapping("400", "411", "05"));
    	itemMappings.put("사과", new ItemMapping("400", "411", "06"));
    	itemMappings.put("사과", new ItemMapping("400", "411", "07"));
    	itemMappings.put("배", new ItemMapping("400", "412", "01"));
    	itemMappings.put("배", new ItemMapping("400", "412", "02"));
    	itemMappings.put("배", new ItemMapping("400", "412", "03"));
    	itemMappings.put("배", new ItemMapping("400", "412", "04"));
    	itemMappings.put("복숭아", new ItemMapping("400", "413", "01"));
    	itemMappings.put("복숭아", new ItemMapping("400", "413", "04"));
    	itemMappings.put("복숭아", new ItemMapping("400", "413", "05"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "01"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "02"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "03"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "06"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "07"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "08"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "09"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "10"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "11"));
    	itemMappings.put("포도", new ItemMapping("400", "414", "12"));
    	itemMappings.put("감귤", new ItemMapping("400", "415", "00"));
    	itemMappings.put("감귤", new ItemMapping("400", "415", "01"));
    	itemMappings.put("감귤", new ItemMapping("400", "415", "02"));
    	itemMappings.put("단감", new ItemMapping("400", "416", "00"));
    	itemMappings.put("바나나", new ItemMapping("400", "418", "02"));
    	itemMappings.put("참다래", new ItemMapping("400", "419", "01"));
    	itemMappings.put("참다래", new ItemMapping("400", "419", "02"));
    	itemMappings.put("파인애플", new ItemMapping("400", "420", "02"));
    	itemMappings.put("오렌지", new ItemMapping("400", "421", "02"));
    	itemMappings.put("오렌지", new ItemMapping("400", "421", "03"));
    	itemMappings.put("오렌지", new ItemMapping("400", "421", "04"));
    	itemMappings.put("오렌지", new ItemMapping("400", "421", "05"));
    	itemMappings.put("오렌지", new ItemMapping("400", "421", "06"));
    	itemMappings.put("자몽", new ItemMapping("400", "423", "00"));
    	itemMappings.put("레몬", new ItemMapping("400", "424", "00"));
    	itemMappings.put("체리", new ItemMapping("400", "425", "00"));
    	itemMappings.put("건포도", new ItemMapping("400", "426", "00"));
    	itemMappings.put("건블루베리", new ItemMapping("400", "427", "00"));
    	itemMappings.put("망고", new ItemMapping("400", "428", "00"));
    	itemMappings.put("아보카도", new ItemMapping("400", "430", "00"));
        // 추가 데이터는 필요시 추가 가능
    }

    public ItemMapping getMappingByItemName(String itemName) {
        return itemMappings.getOrDefault(itemName, null);
    }
}




