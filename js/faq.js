// Funcionalidad de FAQ
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Cerrar otros items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active")
          otherItem.querySelector(".faq-answer").classList.remove("show")
        }
      })

      // Toggle el item actual
      this.classList.toggle("active")
      const answer = this.querySelector(".faq-answer")
      answer.classList.toggle("show")
    })
  })
})
