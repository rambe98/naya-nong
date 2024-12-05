---
name: "✨ Feature"
about: 새로운 기능 추가
title: ''
labels: ''
assignees: ''

---

- type: textarea
    attributes:
      label: 📄 설명
      description: 새로운 기능에 대한 설명을 작성해 주세요.
      placeholder: 자세히 적을수록 좋습니다!
    validations:
      required: true
  - type: textarea
    attributes:
      label: ✅ 작업한 내용
      description: 한 일을 작성해주세요.
      placeholder: 최대한 세분화 해서 적어주세요!
    validations:
      required: true
  - type: textarea
    attributes:
      label: 🙋🏻 참고 자료(코드)
      description: 참고 자료가 있다면 작성해 주세요.
