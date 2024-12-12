package com.test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 이메일 전송 메서드
    public void sendEmail(String toEmail, String subject, String text) {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("rambe0516@gmail.com"); // 보내는 이메일 주소
            messageHelper.setTo(toEmail); // 받는 사람 이메일 주소
            messageHelper.setSubject(subject); // 이메일 제목
            messageHelper.setText(text, true); // 이메일 내용 (HTML 형식)
        };

        mailSender.send(messagePreparator); // 이메일 전송
    }
}
