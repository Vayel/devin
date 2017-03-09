import os

from slugify import slugify
from jinja2 import Template

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(HERE, 'templates', 'index.html')
OUTPUT_PATH = os.path.join(HERE, 'templates', 'output.html')


def split_features(steps):
    for name, step in steps.items():
        half = (len(step['features']) + 1) // 2
        step['features_left'] = step['features'][:half]
        step['features_right'] = step['features'][half:]


def add_slugs(steps):
    for name, step in steps.items():
        step['slug'] = slugify(name)


def add_prices(d, steps, fees):
    d['steps_price'] = sum(step['price'] for name, step in steps.items())
    d['excluding_taxes_price'] = d['steps_price'] + fees
    d['vat'] = d['excluding_taxes_price'] * 0.2
    if int(d['vat']) == d['vat']:
        d['vat'] = int(d['vat'])

    d['total_price'] = d['excluding_taxes_price'] + d['vat']


def generate(*args, **kwargs):
    split_features(kwargs['steps'])
    add_slugs(kwargs['steps'])
    add_prices(kwargs, kwargs['steps'], kwargs['fees'])

    with open(TEMPLATE_PATH) as f:
        template = Template(f.read())

    with open(OUTPUT_PATH, 'w') as f:
        f.write(template.render(*args, **kwargs))


if __name__ == '__main__':
    generate(
        title='Application mobile de saisie',
        version=1,
        date='23/02/17',
        objectives_left='Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing <strong>elit</strong>. Fusce molestie magna at <strong>enim gravida</strong>, sed finibus purus condimentum. Sed luctus tortor vitae enim <strong>sollicitudin</strong>, nec sollicitudin nisl fringilla. Maecenas nisi quam, sagittis vel consectetur at, pulvinar nec enim. Proin ullamcorper <strong>elementum bibendum</strong>.',
        objectives_right='Fusce laoreet <strong>bibendum</strong> erat sed imperdiet. Nunc consequat turpis aliquam lorem <strong>egestas</strong>, et lobortis lectus condimentum. Proin vestibulum risus lorem, ac dapibus augue mollis eget. Quisque <strong>in molestie lacus</strong>, sed condimentum elit. Duis hendrerit eget eros id volutpat.',
        steps={
            'step 1': {
                'objectives': 'step 1 objectives',
                'price': 340,
                'priority': 20,
                'features': [
                    'bla',
                    'bla',
                ],
            },
            'step 2': {
                'objectives': 'step 2 objectives',
                'price': 680,
                'priority': 19,
                'features': [
                    'a',
                    'b',
                    'c',
                ],
            },
        },
        fees=80,
        max_prio=20,
    )
