if (document.querySelectorAll('.docs aside').length > 0) {
  let aside   = document.querySelector('.docs aside'),
      expand  = aside.querySelector('.expand')

  // expand.addEventListener('click', function(e) {

  // })
}

var headerScrolled = function() {
  var header = document.querySelector('header')
  if (document.documentElement.scrollTop > 0) {
    if (header.className.indexOf('scrolled') == -1) header.className += ' scrolled'
  } else {
    header.className = header.className.replace('scrolled', '')
  }
}

headerScrolled()
document.addEventListener('scroll', headerScrolled)