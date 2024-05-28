export const closeModal = async () => {
    const popupContainer = document.getElementById('popup-modal')!;
    const popupHelper = document.getElementById('popup-modal-helper')!;
    popupContainer.style.opacity = '0';
    popupHelper.style.transform = 'scale(0.9)';

    setTimeout(() => {
        popupContainer.style.display = 'none';
    }, 250);
};

export const openModal = async () => {
    const popupContainer = document.getElementById('popup-modal')!;
    const popupHelper = document.getElementById('popup-modal-helper')!;

    popupContainer.style.display = 'grid';
    setTimeout(() => {
        popupContainer.style.opacity = '1';
        popupHelper.style.transform = 'scale(1)';
    }, 1);
};