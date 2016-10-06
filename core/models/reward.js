function Reward(totalFists, description, cssClass, image, currentFists) {
    // always initialize all instance properties
    this.id = 'reward' + totalFists;
    this.totalFists = totalFists;
    this.description = description;
    this.cssClass = cssClass;
    this.image = image;
    this.currentFists = currentFists;
}

Reward.prototype.enabled = function() {
    if (this.currentFists >= this.totalFists) {
        return true;
    } else {
        return false;
    }
};



module.exports = Reward;