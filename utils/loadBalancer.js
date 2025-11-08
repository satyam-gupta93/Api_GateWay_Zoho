const logger = require('./logger');

class RoundRobinLoadBalancer {
  constructor(instances) {
    this.instances = instances;
    this.currentIndex = 0;
  }

  getNextInstance() {
    if (!this.instances || this.instances.length === 0) {
      throw new Error('No instances available');
    }

    const instance = this.instances[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.instances.length;

    logger.info('Load balancer selected instance', {
      instance: instance.name,
      url: instance.url
    });

    return instance;
  }

  addInstance(instance) {
    this.instances.push(instance);
    logger.info('Instance added to load balancer', { instance: instance.name });
  }

  removeInstance(instanceName) {
    const index = this.instances.findIndex(i => i.name === instanceName);
    if (index !== -1) {
      this.instances.splice(index, 1);
      logger.info('Instance removed from load balancer', { instance: instanceName });

      if (this.currentIndex >= this.instances.length) {
        this.currentIndex = 0;
      }
    }
  }

  getInstances() {
    return this.instances;
  }
}

const paymentServiceInstances = [
  { name: 'payment-service-1-instance-1', url: 'http://localhost:5001' },
  { name: 'payment-service-1-instance-2', url: 'http://localhost:5001' }
];

const refundServiceInstances = [
  { name: 'payment-service-2-instance-1', url: 'http://localhost:5002' },
  { name: 'payment-service-2-instance-2', url: 'http://localhost:5002' }
];

const paymentLoadBalancer = new RoundRobinLoadBalancer(paymentServiceInstances);
const refundLoadBalancer = new RoundRobinLoadBalancer(refundServiceInstances);

module.exports = {
  RoundRobinLoadBalancer,
  paymentLoadBalancer,
  refundLoadBalancer
};
