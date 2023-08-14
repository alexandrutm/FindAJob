(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

// document.addEventListener('DOMContentLoaded', function() {
//     // Add an event listener to each tab link
//     document.querySelectorAll('.nav-pills a[data-bs-toggle="pill"]').forEach(tabLink => {
//         tabLink.addEventListener('click', () => {
//             // Get the ID of the selected tab content
//             const selectedTabId = tabLink.getAttribute('href');
//             console.log(`Selected Tab: ${selectedTabId}`);

//             // You can perform additional actions here based on the selected tab,
//             // such as fetching and displaying jobs associated with that tab.
//             // You might need to add AJAX requests or other logic depending on your implementation.
//         });
//     });

//     // You can also add similar event listeners for the job items if you want to track job selection.
// });

document.addEventListener('DOMContentLoaded', function() {
    const jobListContainer = document.querySelector('.job-list-container');

    if (jobListContainer) {
        jobListContainer.addEventListener('click', function(event) {
            const jobItem = event.target.closest('.job-item');

            if (jobItem) {
                const jobDetails = {
                    imageUrl: jobItem.querySelector('.img-fluid').getAttribute('src'),
                    title: jobItem.querySelector('h5').textContent,
                    location: jobItem.querySelector('.fa-map-marker-alt').parentNode.textContent,
                    type: jobItem.querySelector('.fa-clock').parentNode.textContent,
                    salary: jobItem.querySelector('.fa-money-bill-alt').parentNode.textContent,
                    deadline: jobItem.querySelector('.fa-calendar-alt').parentNode.textContent.replace('Data limită: ', ''),
                    description: jobItem.querySelector('.description').textContent
                };

                // Store jobDetails in localStorage
                localStorage.setItem('jobDetails', JSON.stringify(jobDetails));

                window.location.href = 'job-detail.html';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve jobDetails from localStorage
    const storedJobDetails = localStorage.getItem('jobDetails');

    if (storedJobDetails) {
        const jobDetails = JSON.parse(storedJobDetails);

        // Update the content of the selected job container
        const selectedJobContainer = document.querySelector('.selected-job-container');

        if (selectedJobContainer) {
            selectedJobContainer.innerHTML = `
            <div class="d-flex align-items-center mb-5">
                <img class="flex-shrink-0 img-fluid border rounded" src="${jobDetails.imageUrl}" alt="" style="width: 80px; height: 80px;">
                <div class="text-start ps-4">
                    <h3 class="mb-3">${jobDetails.title}</h3>
                    <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${jobDetails.location}</span>
                    <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${jobDetails.type}</span>
                    <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${jobDetails.salary} </span>
                </div>
            </div>
            `;
        }

        const selectedJobDescription = document.querySelector('.selected-job-description');

        if(selectedJobDescription)
        {
            selectedJobDescription.innerHTML=` <h4 class="mb-3">Descriere Job</h4>
            <p>${jobDetails.description}</p>
`
        }

    }
});