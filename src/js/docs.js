let customSizes = false, previewContainer, previewSize;

function refreshPreviewSize () {
    if (previewSize) {
        previewContainer.style.width = (parseInt(previewSize) + (previewContainer.offsetWidth - previewContainer.contentDocument.body.offsetWidth)) + 'px';
    } else {
        previewContainer.style.width = null;
    }
}

window.onload = function () {
    previewContainer = document.getElementById('overviewContentPreview');

    if (previewContainer) {
        const previewSizeInput = document.getElementById('overviewContentSizeInput');
        const previewSizeSelect = document.getElementById('overviewContentSizeSelect');

        previewSizeInput.addEventListener('input', function () {
            if (customSizes) {
                previewSize = previewSizeInput.value;
                refreshPreviewSize();
            }
        });

        previewSizeSelect.addEventListener('change', function (e) {
            customSizes = e.target.value === 'custom';
            previewSizeInput.disabled = !customSizes;
            if (!customSizes) {
                const value = e.target.value ? e.target.value : false;
                if (value) {
                    previewSize = value;
                } else {
                    previewSize = null;
                }
                refreshPreviewSize();
            } else {
                previewSizeInput.value = '';
            }
        });
    }

    const menu = document.getElementById('overviewMenu');
    if (menu) {
        let frame;
        const onMove = function (e) {
            let x = e.pageX;
            if (e.touches) {
                x = e.touches[0].pageX;
            }
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(function () {
                menu.style.width = parseInt(x) + 'px';
            });
        };
        const onEnd = function () {
            previewContainer.style.pointerEvents = null;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
        };
        const menuSizeHelper = document.getElementById('overviewMenuSizeHelper');
        menuSizeHelper.addEventListener('mousedown', function () {
            previewContainer.style.pointerEvents = 'none';
            document.addEventListener('mousemove', onMove, false);
            document.addEventListener('mouseup', onEnd, false);
        }, false);
        menuSizeHelper.addEventListener('touchstart', function () {
            previewContainer.style.pointerEvents = 'none';
            document.addEventListener('touchmove', onMove, false);
            document.addEventListener('touchend', onEnd, false);
        }, false);
    }
};
